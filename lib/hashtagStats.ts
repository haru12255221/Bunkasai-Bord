/**
 * ハッシュタグ統計ユーティリティ
 */

import { Post } from '../types/post';

export interface HashtagStat {
  hashtag: string;
  count: number;
  posts: string[]; // 投稿IDの配列
}

/**
 * 投稿配列からハッシュタグ統計を計算する
 * @param posts - 投稿配列
 * @returns ハッシュタグ統計の配列（使用回数の降順）
 */
export function calculateHashtagStats(posts: Post[]): HashtagStat[] {
  const hashtagMap = new Map<string, HashtagStat>();

  posts.forEach(post => {
    if (post.hashtags && Array.isArray(post.hashtags)) {
      post.hashtags.forEach(hashtag => {
        if (hashtag && typeof hashtag === 'string' && hashtag.trim().length > 0) {
          const normalizedHashtag = hashtag.toLowerCase().trim();
          
          if (hashtagMap.has(normalizedHashtag)) {
            const stat = hashtagMap.get(normalizedHashtag)!;
            stat.count++;
            stat.posts.push(post.id);
          } else {
            hashtagMap.set(normalizedHashtag, {
              hashtag: hashtag, // 元の大文字小文字を保持
              count: 1,
              posts: [post.id]
            });
          }
        }
      });
    }
  });

  // 使用回数の降順でソート
  return Array.from(hashtagMap.values())
    .sort((a, b) => b.count - a.count);
}

/**
 * 人気ハッシュタグを取得する
 * @param posts - 投稿配列
 * @param limit - 取得する最大数（デフォルト: 10）
 * @returns 人気ハッシュタグの配列
 */
export function getPopularHashtags(
  posts: Post[], 
  limit: number = 10
): Array<{ hashtag: string; count: number }> {
  const stats = calculateHashtagStats(posts);
  
  return stats
    .slice(0, limit)
    .map(stat => ({
      hashtag: stat.hashtag,
      count: stat.count
    }));
}

/**
 * 特定のハッシュタグを含む投稿をフィルタリングする
 * @param posts - 投稿配列
 * @param hashtag - フィルター対象のハッシュタグ
 * @returns フィルタリングされた投稿配列
 */
export function filterPostsByHashtag(posts: Post[], hashtag: string): Post[] {
  if (!hashtag || hashtag.trim() === '') {
    return posts;
  }

  const normalizedFilter = hashtag.toLowerCase().trim();
  
  return posts.filter(post => {
    if (!post.hashtags || !Array.isArray(post.hashtags)) {
      return false;
    }
    
    return post.hashtags.some(tag => 
      typeof tag === 'string' && 
      tag.toLowerCase().includes(normalizedFilter)
    );
  });
}

/**
 * ハッシュタグの使用傾向を分析する
 * @param posts - 投稿配列
 * @returns 分析結果
 */
export function analyzeHashtagTrends(posts: Post[]): {
  totalHashtags: number;
  uniqueHashtags: number;
  averageHashtagsPerPost: number;
  mostPopular: string | null;
  leastUsed: string[];
} {
  const stats = calculateHashtagStats(posts);
  const totalHashtags = stats.reduce((sum, stat) => sum + stat.count, 0);
  const postsWithHashtags = posts.filter(post => 
    post.hashtags && Array.isArray(post.hashtags) && post.hashtags.length > 0
  );

  return {
    totalHashtags,
    uniqueHashtags: stats.length,
    averageHashtagsPerPost: postsWithHashtags.length > 0 
      ? totalHashtags / postsWithHashtags.length 
      : 0,
    mostPopular: stats.length > 0 ? stats[0].hashtag : null,
    leastUsed: stats.filter(stat => stat.count === 1).map(stat => stat.hashtag)
  };
}

/**
 * ハッシュタグの共起関係を分析する
 * @param posts - 投稿配列
 * @param targetHashtag - 対象のハッシュタグ
 * @returns 共起するハッシュタグの配列
 */
export function getCoOccurringHashtags(
  posts: Post[], 
  targetHashtag: string
): Array<{ hashtag: string; count: number }> {
  const normalizedTarget = targetHashtag.toLowerCase().trim();
  const coOccurrenceMap = new Map<string, number>();

  posts.forEach(post => {
    if (!post.hashtags || !Array.isArray(post.hashtags)) {
      return;
    }

    const hasTarget = post.hashtags.some(tag => 
      typeof tag === 'string' && 
      tag.toLowerCase().trim() === normalizedTarget
    );

    if (hasTarget) {
      post.hashtags.forEach(hashtag => {
        if (typeof hashtag === 'string') {
          const normalized = hashtag.toLowerCase().trim();
          if (normalized !== normalizedTarget) {
            coOccurrenceMap.set(
              hashtag, 
              (coOccurrenceMap.get(hashtag) || 0) + 1
            );
          }
        }
      });
    }
  });

  return Array.from(coOccurrenceMap.entries())
    .map(([hashtag, count]) => ({ hashtag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * ハッシュタグ検索の候補を生成する
 * @param posts - 投稿配列
 * @param query - 検索クエリ
 * @param limit - 候補の最大数
 * @returns 検索候補の配列
 */
export function getHashtagSuggestions(
  posts: Post[], 
  query: string, 
  limit: number = 5
): Array<{ hashtag: string; count: number }> {
  if (!query || query.trim() === '') {
    return getPopularHashtags(posts, limit);
  }

  const normalizedQuery = query.toLowerCase().trim();
  const stats = calculateHashtagStats(posts);

  return stats
    .filter(stat => 
      stat.hashtag.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit)
    .map(stat => ({
      hashtag: stat.hashtag,
      count: stat.count
    }));
}