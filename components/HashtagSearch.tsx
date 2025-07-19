"use client";

import { useState, useEffect, useRef } from 'react';
import { useHashtags } from '../hooks/useHashtags';
import { Post } from '../types/post';

interface HashtagSearchProps {
  posts: Post[];
  onHashtagSelect: (hashtag: string) => void;
  currentFilter?: string | null;
  className?: string;
}

export default function HashtagSearch({ 
  posts, 
  onHashtagSelect, 
  currentFilter,
  className = '' 
}: HashtagSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchHashtags } = useHashtags(posts);

  // 検索結果を取得（デバウンス処理付き）
  const [searchResults, setSearchResults] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const results = searchHashtags(query);
        setSearchResults(results.slice(0, 8)); // 最大8件表示
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);
      } else {
        setSearchResults([]);
        setIsOpen(false);
      }
    }, 300); // 300ms のデバウンス

    return () => clearTimeout(timer);
  }, [query, searchHashtags]);

  // キーボード操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleHashtagSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // ハッシュタグ選択処理
  const handleHashtagSelect = (hashtag: string) => {
    onHashtagSelect(hashtag);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // 検索クリア
  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* 検索入力フィールド */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim() && searchResults.length > 0) {
                setIsOpen(true);
              }
            }}
            onBlur={() => {
              // 少し遅延させてクリックイベントを処理できるようにする
              setTimeout(() => setIsOpen(false), 150);
            }}
            placeholder="ハッシュタグを検索..."
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* オートコンプリート結果 */}
        {isOpen && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {searchResults.map((hashtag, index) => (
              <button
                key={hashtag}
                onClick={() => handleHashtagSelect(hashtag)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                  index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === searchResults.length - 1 ? 'rounded-b-lg' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">#{hashtag}</span>
                  {currentFilter === hashtag && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      フィルター中
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 検索結果が見つからない場合 */}
      {query.trim() && searchResults.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
          「{query}」に一致するハッシュタグが見つかりません
        </div>
      )}
    </div>
  );
}