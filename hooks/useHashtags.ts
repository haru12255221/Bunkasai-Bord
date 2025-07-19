import { useState, useEffect, useMemo } from 'react';
import { Post } from '../types/post';
import { getPopularHashtags } from '../lib/hashtagStats';

/**
 * ハッシュタグ関連の機能を提供するカスタムフック
 */
export function useHashtags(posts: Post[] = []) {
  // 人気ハッシュタグの状態
  const [isLoading, setIsLoading] = useState(false);
  
  // 人気ハッシュタグを計算（メモ化で最適化）
  const popularHashtags = useMemo(() => {
    if (posts.length === 0) return [];
    
    setIsLoading(true);
    
    // パフォーマンス最適化：大量データの場合は処理を分割
    const result = posts.length > 100 
      ? getPopularHashtags(posts.slice(-100), 10) // 最新100件のみ処理
      : getPopularHashtags(posts, 10);
    
    setIsLoading(false);
    return result;
  }, [posts]);

  // ハッシュタグ検索機能
  const searchHashtags = (query: string): string[] => {
    if (!query.trim()) return [];
    
    // 全ハッシュタグを取得
    const allHashtags = posts.flatMap(post => post.hashtags || []);
    const uniqueHashtags = Array.from(new Set(allHashtags));
    
    // 部分一致検索
    return uniqueHashtags.filter(hashtag => 
      hashtag.toLowerCase().includes(query.toLowerCase())
    );
  };

  // ハッシュタグバリデーション機能（高速化版）
  const validateHashtag = useMemo(() => (
    newHashtag: string, 
    selectedHashtags: string[] = [], 
    extractedHashtags: string[] = []
  ) => {
    const trimmed = newHashtag.trim();
    
    if (!trimmed) {
      return { isValid: false, error: null };
    }
    
    // 高速検索のためSetを使用
    const selectedSet = new Set(selectedHashtags || []);
    const extractedSet = new Set(extractedHashtags || []);
    
    if (selectedSet.has(trimmed)) {
      return { isValid: false, error: 'このハッシュタグは既に選択されています' };
    }
    
    if (extractedSet.has(trimmed)) {
      return { isValid: false, error: 'このハッシュタグは投稿テキストから自動抽出されます' };
    }
    
    // 新しいハッシュタグを追加した場合の総数をチェック
    const totalCount = selectedHashtags.length + extractedHashtags.length + 1; // +1 は追加予定のハッシュタグ
    if (totalCount > 10) {
      return { isValid: false, error: 'ハッシュタグは最大10個までです' };
    }
    
    return { isValid: true, error: null };
  }, []);

  return {
    // データ
    popularHashtags,
    isLoading,
    
    // 関数
    searchHashtags,
    validateHashtag,
  };
}