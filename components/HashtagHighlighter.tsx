/**
 * ハッシュタグハイライト表示コンポーネント
 * テキスト内のハッシュタグをリアルタイムでハイライト表示
 */

"use client";

import React from 'react';
import { extractHashtags } from '../lib/hashtagUtils';

interface HashtagHighlighterProps {
  text: string;
  className?: string;
  onHashtagClick?: (hashtag: string) => void;
}

export default function HashtagHighlighter({ 
  text, 
  className = '', 
  onHashtagClick 
}: HashtagHighlighterProps) {
  if (!text) {
    return <span className={className}></span>;
  }

  // ハッシュタグの正規表現パターン（hashtagUtils.tsと同じ）
  const hashtagRegex = /#([^\s#\n\r\t.,!?;:()[\]{}「」『』。、！？；：（）［］｛｝]+)/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  // テキストをハッシュタグ部分と通常テキスト部分に分割
  while ((match = hashtagRegex.exec(text)) !== null) {
    const fullMatch = match[0]; // #を含む完全なハッシュタグ
    const hashtagText = match[1]; // #を除いたハッシュタグ部分
    const matchIndex = match.index;

    // ハッシュタグの前の通常テキスト
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    // ハッシュタグ部分をハイライト表示
    parts.push(
      <span
        key={`hashtag-${matchIndex}`}
        className={`inline-block px-1 py-0.5 mx-0.5 bg-blue-100 text-blue-800 rounded text-sm font-medium ${
          onHashtagClick ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''
        }`}
        onClick={onHashtagClick ? () => onHashtagClick(hashtagText) : undefined}
        title={onHashtagClick ? `クリックして「${hashtagText}」でフィルター` : undefined}
      >
        {fullMatch}
      </span>
    );

    lastIndex = matchIndex + fullMatch.length;
  }

  // 最後の通常テキスト
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <span className={className}>
      {parts.length > 0 ? parts : text}
    </span>
  );
}

/**
 * テキストエリア用のハッシュタグプレビューコンポーネント
 */
interface HashtagPreviewProps {
  text: string;
  className?: string;
}

export function HashtagPreview({ text, className = '' }: HashtagPreviewProps) {
  const extractedHashtags = extractHashtags(text);

  if (extractedHashtags.length === 0) {
    return null;
  }

  return (
    <div className={`mt-2 ${className}`}>
      <div className="text-xs text-gray-600 mb-1">
        検出されたハッシュタグ:
      </div>
      <div className="flex flex-wrap gap-1">
        {extractedHashtags.map((hashtag, index) => (
          <span
            key={index}
            className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
          >
            #{hashtag}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * インライン編集用のハッシュタグハイライター
 */
interface InlineHashtagEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
}

export function InlineHashtagEditor({
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  maxLength
}: InlineHashtagEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full resize-none ${className}`}
        disabled={disabled}
        maxLength={maxLength}
        style={{
          background: 'transparent',
          color: 'transparent',
          caretColor: '#374151', // gray-700
          position: 'relative',
          zIndex: 2
        }}
      />
      
      {/* ハイライト表示用のオーバーレイ */}
      <div
        className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words px-3 py-2"
        style={{
          zIndex: 1,
          fontSize: 'inherit',
          fontFamily: 'inherit',
          lineHeight: 'inherit'
        }}
      >
        <HashtagHighlighter text={value} />
      </div>
    </div>
  );
}