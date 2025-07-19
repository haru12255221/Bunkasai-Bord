/**
 * ハッシュタグ統計ユーティリティのテスト
 */

import {
  calculateHashtagStats,
  getPopularHashtags,
  filterPostsByHashtag,
  analyzeHashtagTrends,
  getCoOccurringHashtags,
  getHashtagSuggestions
} from '../hashtagStats';
import { Post } from '../../types/post';

describe('hashtagStats', () => {
  // テスト用のサンプル投稿データ
  const samplePosts: Post[] = [
    {
      id: 'post1',
      text: '今日は文化祭で楽しかった！',
      nickname: 'ユーザー1',
      hashtags: ['文化祭', '楽しい', '感想'],
      createdAt: new Date('2024-01-01'),
      userId: 'user1'
    },
    {
      id: 'post2',
      text: '文化祭の準備頑張ろう！',
      nickname: 'ユーザー2',
      hashtags: ['文化祭', '準備', '応援'],
      createdAt: new Date('2024-01-02'),
      userId: 'user2'
    },
    {
      id: 'post3',
      text: '質問があります',
      nickname: 'ユーザー3',
      hashtags: ['質問'],
      createdAt: new Date('2024-01-03'),
      userId: 'user3'
    },
    {
      id: 'post4',
      text: '楽しい一日でした',
      nickname: 'ユーザー4',
      hashtags: ['楽しい', '感想'],
      createdAt: new Date('2024-01-04'),
      userId: 'user4'
    },
    {
      id: 'post5',
      text: 'ハッシュタグなしの投稿',
      nickname: 'ユーザー5',
      hashtags: [],
      createdAt: new Date('2024-01-05'),
      userId: 'user5'
    }
  ];

  describe('calculateHashtagStats', () => {
    test('ハッシュタグ統計が正しく計算される', () => {
      const stats = calculateHashtagStats(samplePosts);
      
      expect(stats).toHaveLength(6); // 文化祭、楽しい、感想、準備、応援、質問
      
      // 使用回数の降順でソートされている
      expect(stats[0].hashtag).toBe('文化祭');
      expect(stats[0].count).toBe(2);
      expect(stats[0].posts).toEqual(['post1', 'post2']);
    });

    test('空の投稿配列で空の統計が返される', () => {
      const stats = calculateHashtagStats([]);
      expect(stats).toEqual([]);
    });

    test('ハッシュタグがない投稿は無視される', () => {
      const postsWithoutHashtags: Post[] = [
        {
          id: 'post1',
          text: 'テスト投稿',
          nickname: 'ユーザー',
          hashtags: [],
          createdAt: new Date(),
          userId: 'user1'
        }
      ];
      
      const stats = calculateHashtagStats(postsWithoutHashtags);
      expect(stats).toEqual([]);
    });

    test('大文字小文字を区別しない統計計算', () => {
      const postsWithCaseVariations: Post[] = [
        {
          id: 'post1',
          text: 'テスト1',
          nickname: 'ユーザー1',
          hashtags: ['Festival'],
          createdAt: new Date(),
          userId: 'user1'
        },
        {
          id: 'post2',
          text: 'テスト2',
          nickname: 'ユーザー2',
          hashtags: ['festival'],
          createdAt: new Date(),
          userId: 'user2'
        }
      ];
      
      const stats = calculateHashtagStats(postsWithCaseVariations);
      expect(stats).toHaveLength(1);
      expect(stats[0].count).toBe(2);
    });
  });

  describe('getPopularHashtags', () => {
    test('人気ハッシュタグが正しく取得される', () => {
      const popular = getPopularHashtags(samplePosts, 3);
      
      expect(popular).toHaveLength(3);
      expect(popular[0]).toEqual({ hashtag: '文化祭', count: 2 });
      expect(popular[1]).toEqual({ hashtag: '楽しい', count: 2 });
      expect(popular[2]).toEqual({ hashtag: '感想', count: 2 });
    });

    test('制限数が統計数より多い場合', () => {
      const popular = getPopularHashtags(samplePosts, 10);
      expect(popular.length).toBeLessThanOrEqual(10);
    });

    test('デフォルト制限数（10）が適用される', () => {
      const popular = getPopularHashtags(samplePosts);
      expect(popular.length).toBeLessThanOrEqual(10);
    });
  });

  describe('filterPostsByHashtag', () => {
    test('指定したハッシュタグを含む投稿がフィルタリングされる', () => {
      const filtered = filterPostsByHashtag(samplePosts, '文化祭');
      
      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('post1');
      expect(filtered[1].id).toBe('post2');
    });

    test('部分一致でフィルタリングされる', () => {
      const filtered = filterPostsByHashtag(samplePosts, '楽');
      
      expect(filtered).toHaveLength(2); // '楽しい'を含む投稿
      expect(filtered[0].id).toBe('post1');
      expect(filtered[1].id).toBe('post4');
    });

    test('空文字列で全投稿が返される', () => {
      const filtered = filterPostsByHashtag(samplePosts, '');
      expect(filtered).toEqual(samplePosts);
    });

    test('存在しないハッシュタグで空配列が返される', () => {
      const filtered = filterPostsByHashtag(samplePosts, '存在しない');
      expect(filtered).toEqual([]);
    });

    test('大文字小文字を無視してフィルタリング', () => {
      const postsWithCaseVariations: Post[] = [
        {
          id: 'post1',
          text: 'テスト',
          nickname: 'ユーザー',
          hashtags: ['Festival'],
          createdAt: new Date(),
          userId: 'user1'
        }
      ];
      
      const filtered = filterPostsByHashtag(postsWithCaseVariations, 'festival');
      expect(filtered).toHaveLength(1);
    });
  });

  describe('analyzeHashtagTrends', () => {
    test('ハッシュタグ傾向が正しく分析される', () => {
      const trends = analyzeHashtagTrends(samplePosts);
      
      expect(trends.totalHashtags).toBe(9); // 全ハッシュタグ数
      expect(trends.uniqueHashtags).toBe(6); // ユニークハッシュタグ数
      expect(trends.mostPopular).toBe('文化祭');
      expect(trends.averageHashtagsPerPost).toBeCloseTo(2.25); // 9 / 4 (ハッシュタグありの投稿数)
    });

    test('空の投稿配列で初期値が返される', () => {
      const trends = analyzeHashtagTrends([]);
      
      expect(trends.totalHashtags).toBe(0);
      expect(trends.uniqueHashtags).toBe(0);
      expect(trends.averageHashtagsPerPost).toBe(0);
      expect(trends.mostPopular).toBeNull();
      expect(trends.leastUsed).toEqual([]);
    });

    test('1回だけ使用されたハッシュタグが正しく識別される', () => {
      const trends = analyzeHashtagTrends(samplePosts);
      
      expect(trends.leastUsed).toContain('準備');
      expect(trends.leastUsed).toContain('応援');
      expect(trends.leastUsed).toContain('質問');
    });
  });

  describe('getCoOccurringHashtags', () => {
    test('共起するハッシュタグが正しく取得される', () => {
      const coOccurring = getCoOccurringHashtags(samplePosts, '文化祭');
      
      expect(coOccurring).toHaveLength(4); // 楽しい、感想、準備、応援
      expect(coOccurring.some(item => item.hashtag === '楽しい')).toBe(true);
      expect(coOccurring.some(item => item.hashtag === '感想')).toBe(true);
    });

    test('存在しないハッシュタグで空配列が返される', () => {
      const coOccurring = getCoOccurringHashtags(samplePosts, '存在しない');
      expect(coOccurring).toEqual([]);
    });

    test('共起回数で降順ソートされる', () => {
      const coOccurring = getCoOccurringHashtags(samplePosts, '楽しい');
      
      // '楽しい'と共起するのは'感想'(2回)、'文化祭'(1回)
      expect(coOccurring[0].hashtag).toBe('感想');
      expect(coOccurring[0].count).toBe(2);
    });
  });

  describe('getHashtagSuggestions', () => {
    test('検索クエリに基づく候補が返される', () => {
      const suggestions = getHashtagSuggestions(samplePosts, '文', 3);
      
      expect(suggestions.some(item => item.hashtag === '文化祭')).toBe(true);
    });

    test('空のクエリで人気ハッシュタグが返される', () => {
      const suggestions = getHashtagSuggestions(samplePosts, '', 3);
      
      expect(suggestions).toHaveLength(3);
      expect(suggestions[0].hashtag).toBe('文化祭');
    });

    test('制限数が正しく適用される', () => {
      const suggestions = getHashtagSuggestions(samplePosts, '', 2);
      expect(suggestions).toHaveLength(2);
    });

    test('部分一致で候補が検索される', () => {
      const suggestions = getHashtagSuggestions(samplePosts, '楽', 5);
      
      expect(suggestions.some(item => item.hashtag === '楽しい')).toBe(true);
    });

    test('大文字小文字を無視して検索される', () => {
      const postsWithCaseVariations: Post[] = [
        {
          id: 'post1',
          text: 'テスト',
          nickname: 'ユーザー',
          hashtags: ['Festival'],
          createdAt: new Date(),
          userId: 'user1'
        }
      ];
      
      const suggestions = getHashtagSuggestions(postsWithCaseVariations, 'fest', 5);
      expect(suggestions.some(item => item.hashtag === 'Festival')).toBe(true);
    });
  });

  describe('エッジケース', () => {
    test('null や undefined のハッシュタグが適切に処理される', () => {
      const postsWithNullHashtags: Post[] = [
        {
          id: 'post1',
          text: 'テスト',
          nickname: 'ユーザー',
          hashtags: ['有効', null as unknown as string, undefined as unknown as string, ''],
          createdAt: new Date(),
          userId: 'user1'
        }
      ];
      
      const stats = calculateHashtagStats(postsWithNullHashtags);
      expect(stats).toHaveLength(1);
      expect(stats[0].hashtag).toBe('有効');
    });

    test('空文字列のハッシュタグが無視される', () => {
      const postsWithEmptyHashtags: Post[] = [
        {
          id: 'post1',
          text: 'テスト',
          nickname: 'ユーザー',
          hashtags: ['有効', '', '   '],
          createdAt: new Date(),
          userId: 'user1'
        }
      ];
      
      const stats = calculateHashtagStats(postsWithEmptyHashtags);
      expect(stats).toHaveLength(1);
      expect(stats[0].hashtag).toBe('有効');
    });

    test('非文字列のハッシュタグが無視される', () => {
      const postsWithInvalidHashtags: Post[] = [
        {
          id: 'post1',
          text: 'テスト',
          nickname: 'ユーザー',
          hashtags: ['有効', 123 as unknown as string, true as unknown as string],
          createdAt: new Date(),
          userId: 'user1'
        }
      ];
      
      const stats = calculateHashtagStats(postsWithInvalidHashtags);
      expect(stats).toHaveLength(1);
      expect(stats[0].hashtag).toBe('有効');
    });
  });
});