/**
 * Post型定義のテスト
 */

import { Post, NewPost, LegacyPost } from '../post';
import { Timestamp } from 'firebase/firestore';

describe('Post Types', () => {
  describe('Post interface', () => {
    test('Post インターフェースが正しい構造を持つ', () => {
      const mockPost: Post = {
        id: 'test-id',
        text: 'テスト投稿',
        nickname: 'テストユーザー',
        hashtags: ['感想', '楽しい'],
        createdAt: new Date(),
        userId: 'user-123'
      };

      expect(mockPost.id).toBe('test-id');
      expect(mockPost.text).toBe('テスト投稿');
      expect(mockPost.nickname).toBe('テストユーザー');
      expect(mockPost.hashtags).toEqual(['感想', '楽しい']);
      expect(mockPost.userId).toBe('user-123');
      expect(mockPost.createdAt).toBeInstanceOf(Date);
    });

    test('Post インターフェースでハッシュタグが必須フィールドである', () => {
      // TypeScriptコンパイル時にエラーになることを確認
      // @ts-expect-error - hashtags フィールドが必須
      const invalidPost: Post = {
        id: 'test-id',
        text: 'テスト投稿',
        nickname: 'テストユーザー',
        // hashtags: [], // 必須フィールドが欠けている
        createdAt: new Date(),
        userId: 'user-123'
      };
    });
  });

  describe('NewPost interface', () => {
    test('NewPost インターフェースが正しい構造を持つ', () => {
      const mockNewPost: NewPost = {
        text: 'テスト投稿',
        hashtags: ['感想', '楽しい']
      };

      expect(mockNewPost.text).toBe('テスト投稿');
      expect(mockNewPost.hashtags).toEqual(['感想', '楽しい']);
    });

    test('NewPost でハッシュタグがオプショナルである', () => {
      const mockNewPostWithoutHashtags: NewPost = {
        text: 'テスト投稿'
        // hashtags は省略可能
      };

      expect(mockNewPostWithoutHashtags.text).toBe('テスト投稿');
      expect(mockNewPostWithoutHashtags.hashtags).toBeUndefined();
    });
  });

  describe('LegacyPost interface', () => {
    test('LegacyPost インターフェースが移行期間中のデータ構造を持つ', () => {
      const mockLegacyPost: LegacyPost = {
        id: 'legacy-id',
        text: 'レガシー投稿',
        nickname: 'レガシーユーザー',
        categoryId: '感想',
        createdAt: new Date(),
        userId: 'user-123'
      };

      expect(mockLegacyPost.id).toBe('legacy-id');
      expect(mockLegacyPost.text).toBe('レガシー投稿');
      expect(mockLegacyPost.nickname).toBe('レガシーユーザー');
      expect(mockLegacyPost.categoryId).toBe('感想');
      expect(mockLegacyPost.userId).toBe('user-123');
      expect(mockLegacyPost.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Type compatibility', () => {
    test('Post と LegacyPost は互換性がない（意図的）', () => {
      const legacyPost: LegacyPost = {
        id: 'legacy-id',
        text: 'レガシー投稿',
        nickname: 'レガシーユーザー',
        categoryId: '感想',
        createdAt: new Date(),
        userId: 'user-123'
      };

      // @ts-expect-error - LegacyPost は Post に直接代入できない
      const post: Post = legacyPost;
    });

    test('NewPost は最小限の必須フィールドのみを持つ', () => {
      const newPost: NewPost = {
        text: 'テスト投稿'
      };

      // NewPost には id, nickname, createdAt, userId は含まれない
      expect('id' in newPost).toBe(false);
      expect('nickname' in newPost).toBe(false);
      expect('createdAt' in newPost).toBe(false);
      expect('userId' in newPost).toBe(false);
    });
  });
});