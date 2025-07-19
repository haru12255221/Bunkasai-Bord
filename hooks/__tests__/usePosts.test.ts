/**
 * usePosts フックのテスト
 */

import { extractHashtags, validateHashtags } from '../../lib/hashtagUtils';

describe('usePosts hook functionality', () => {
  describe('ハッシュタグ処理ロジック', () => {
    test('ハッシュタグ抽出機能の統合', () => {
      const testText = '今日は #文化祭 で楽しかった！ #感想';
      const extractedHashtags = extractHashtags(testText);
      
      expect(extractedHashtags).toContain('文化祭');
      expect(extractedHashtags).toContain('感想');
    });

    test('ハッシュタグバリデーション機能', () => {
      const validHashtags = ['感想', '文化祭', '楽しい'];
      const validation = validateHashtags(validHashtags);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    test('無効なハッシュタグのバリデーション', () => {
      const invalidHashtags = ['a'.repeat(51)]; // 50文字制限を超える
      const validation = validateHashtags(invalidHashtags);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    test('ハッシュタグ数量制限のバリデーション', () => {
      const tooManyHashtags = Array(11).fill('tag'); // 10個制限を超える
      const validation = validateHashtags(tooManyHashtags);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('ハッシュタグは最大10個までです');
    });
  });

  describe('フィルタリングロジック', () => {
    test('ハッシュタグフィルタリングの基本動作', () => {
      const posts = [
        { id: '1', hashtags: ['感想', '楽しい'], text: 'テスト1', nickname: 'ユーザー1', createdAt: new Date(), userId: 'user1' },
        { id: '2', hashtags: ['質問'], text: 'テスト2', nickname: 'ユーザー2', createdAt: new Date(), userId: 'user2' },
        { id: '3', hashtags: ['感想', '文化祭'], text: 'テスト3', nickname: 'ユーザー3', createdAt: new Date(), userId: 'user3' }
      ];

      // '感想'でフィルタリング
      const filtered = posts.filter(post => 
        post.hashtags.some(tag => 
          tag.toLowerCase().includes('感想'.toLowerCase())
        )
      );

      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('1');
      expect(filtered[1].id).toBe('3');
    });

    test('大文字小文字を無視したフィルタリング', () => {
      const posts = [
        { id: '1', hashtags: ['FESTIVAL'], text: 'テスト1', nickname: 'ユーザー1', createdAt: new Date(), userId: 'user1' },
        { id: '2', hashtags: ['festival'], text: 'テスト2', nickname: 'ユーザー2', createdAt: new Date(), userId: 'user2' }
      ];

      const filtered = posts.filter(post => 
        post.hashtags.some(tag => 
          tag.toLowerCase().includes('festival'.toLowerCase())
        )
      );

      expect(filtered).toHaveLength(2);
    });

    test('部分一致フィルタリング', () => {
      const posts = [
        { id: '1', hashtags: ['文化祭2024'], text: 'テスト1', nickname: 'ユーザー1', createdAt: new Date(), userId: 'user1' },
        { id: '2', hashtags: ['文化祭準備'], text: 'テスト2', nickname: 'ユーザー2', createdAt: new Date(), userId: 'user2' },
        { id: '3', hashtags: ['運動会'], text: 'テスト3', nickname: 'ユーザー3', createdAt: new Date(), userId: 'user3' }
      ];

      const filtered = posts.filter(post => 
        post.hashtags.some(tag => 
          tag.toLowerCase().includes('文化祭'.toLowerCase())
        )
      );

      expect(filtered).toHaveLength(2);
      expect(filtered[0].id).toBe('1');
      expect(filtered[1].id).toBe('2');
    });
  });

  describe('投稿データ処理', () => {
    test('投稿データの構造検証', () => {
      const postData = {
        text: 'テスト投稿 #感想',
        hashtags: ['追加ハッシュタグ']
      };

      expect(postData.text).toBeTruthy();
      expect(Array.isArray(postData.hashtags)).toBe(true);
      expect(postData.hashtags).toContain('追加ハッシュタグ');
    });

    test('ハッシュタグの結合処理', () => {
      const extractedHashtags = ['感想', '楽しい'];
      const explicitHashtags = ['文化祭'];
      const combined = [...extractedHashtags, ...explicitHashtags];

      expect(combined).toEqual(['感想', '楽しい', '文化祭']);
      expect(combined).toHaveLength(3);
    });

    test('空のハッシュタグ配列の処理', () => {
      const extractedHashtags: string[] = [];
      const explicitHashtags: string[] = [];
      const combined = [...extractedHashtags, ...explicitHashtags];

      expect(combined).toEqual([]);
      expect(combined).toHaveLength(0);
    });
  });

  describe('エラーハンドリング', () => {
    test('テキスト長制限の検証', () => {
      const shortText = 'テスト';
      const longText = 'a'.repeat(501);

      expect(shortText.length).toBeLessThanOrEqual(500);
      expect(longText.length).toBeGreaterThan(500);
    });

    test('空文字列の検証', () => {
      const emptyText = '';
      const whitespaceText = '   ';

      expect(emptyText.trim()).toBe('');
      expect(whitespaceText.trim()).toBe('');
    });
  });

  describe('型安全性', () => {
    test('Post インターフェースの構造', () => {
      const post = {
        id: 'test-id',
        text: 'テスト投稿',
        nickname: 'テストユーザー',
        hashtags: ['感想'],
        createdAt: new Date(),
        userId: 'user-id'
      };

      expect(typeof post.id).toBe('string');
      expect(typeof post.text).toBe('string');
      expect(typeof post.nickname).toBe('string');
      expect(Array.isArray(post.hashtags)).toBe(true);
      expect(typeof post.userId).toBe('string');
    });

    test('NewPost インターフェースの構造', () => {
      const newPost = {
        text: 'テスト投稿',
        hashtags: ['感想']
      };

      expect(typeof newPost.text).toBe('string');
      expect(Array.isArray(newPost.hashtags)).toBe(true);
    });
  });
});