/**
 * 投稿コンテンツ表示コンポーネント
 * テキスト内のハッシュタグをクリック可能なリンクとして表示
 */

"use client";

import React, { useMemo } from 'react';
import HashtagHighlighter from './HashtagHighlighter';

interface PostContentProps {
  text: string;
  onHashtagClick?: (hashtag: string) => void;
  className?: string;
}

export default function PostContent({ 
  text, 
  onHashtagClick, 
  className = '' 
}: PostContentProps) {
  // ハッシュタグハイライト処理をメモ化
  const highlightedContent = useMemo(() => (
    <HashtagHighlighter 
      text={text} 
      onHashtagClick={onHashtagClick}
    />
  ), [text, onHashtagClick]);

  return (
    <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {highlightedContent}
    </div>
  );
}

/**
 * ハッシュタグバッジ表示コンポーネント
 */
interface HashtagBadgesProps {
  hashtags: string[];
  onHashtagClick?: (hashtag: string) => void;
  currentFilter?: string | null;
  className?: string;
}

export function HashtagBadges({ 
  hashtags, 
  onHashtagClick, 
  currentFilter,
  className = '' 
}: HashtagBadgesProps) {
  if (!hashtags || hashtags.length === 0) {
    return null;
  }

  const getHashtagStyle = (hashtag: string) => {
    const isActive = currentFilter === hashtag;
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200';
    
    if (isActive) {
      return `${baseStyles} bg-indigo-600 text-white ring-2 ring-indigo-300`;
    }

    // デフォルトハッシュタグ（旧カテゴリー）のスタイル
    const categoryStyles = {
      '感想': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      '質問': 'bg-green-100 text-green-800 hover:bg-green-200',
      '応援': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      'お知らせ': 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    const categoryStyle = categoryStyles[hashtag as keyof typeof categoryStyles];
    if (categoryStyle) {
      return `${baseStyles} ${categoryStyle}`;
    }

    // カスタムハッシュタグのスタイル
    return `${baseStyles} bg-purple-100 text-purple-800 hover:bg-purple-200`;
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {hashtags.map((hashtag, index) => (
        <button
          key={index}
          onClick={() => onHashtagClick?.(hashtag)}
          className={`${getHashtagStyle(hashtag)} ${
            onHashtagClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'
          }`}
          disabled={!onHashtagClick}
          title={onHashtagClick ? `「${hashtag}」でフィルター` : undefined}
        >
          #{hashtag}
        </button>
      ))}
    </div>
  );
}

/**
 * フィルター状態表示コンポーネント
 */
interface FilterStatusProps {
  currentFilter: string | null;
  onClearFilter: () => void;
  filteredCount: number;
  totalCount: number;
  className?: string;
}

export function FilterStatus({ 
  currentFilter, 
  onClearFilter, 
  filteredCount, 
  totalCount,
  className = '' 
}: FilterStatusProps) {
  if (!currentFilter) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          <div>
            <div className="text-sm font-medium text-blue-900">
              フィルター中: <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">#{currentFilter}</span>
            </div>
            <div className="text-xs text-blue-700">
              {filteredCount} / {totalCount} 件の投稿を表示
            </div>
          </div>
        </div>
        <button
          onClick={onClearFilter}
          className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          すべて表示
        </button>
      </div>
    </div>
  );
}

/**
 * ハッシュタグ統計表示コンポーネント
 */
interface HashtagStatsProps {
  hashtags: Array<{ hashtag: string; count: number }>;
  onHashtagClick?: (hashtag: string) => void;
  currentFilter?: string | null;
  maxDisplay?: number;
  className?: string;
}

export function HashtagStats({ 
  hashtags, 
  onHashtagClick, 
  currentFilter,
  maxDisplay = 10,
  className = '' 
}: HashtagStatsProps) {
  if (!hashtags || hashtags.length === 0) {
    return null;
  }

  const displayHashtags = hashtags.slice(0, maxDisplay);

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        よく使われるハッシュタグ
      </h3>
      <div className="space-y-2">
        {displayHashtags.map(({ hashtag, count }) => {
          const isActive = currentFilter === hashtag;
          return (
            <div key={hashtag} className="flex items-center justify-between">
              <button
                onClick={() => onHashtagClick?.(hashtag)}
                className={`flex-1 text-left px-2 py-1 rounded text-sm transition-colors ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-800 font-medium' 
                    : 'hover:bg-gray-100 text-gray-700'
                } ${onHashtagClick ? 'cursor-pointer' : 'cursor-default'}`}
                disabled={!onHashtagClick}
              >
                #{hashtag}
              </button>
              <span className="text-xs text-gray-500 ml-2">
                {count}件
              </span>
            </div>
          );
        })}
      </div>
      {hashtags.length > maxDisplay && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          他 {hashtags.length - maxDisplay} 個のハッシュタグ
        </div>
      )}
    </div>
  );
}