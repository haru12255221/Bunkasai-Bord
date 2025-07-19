/**
 * データ移行機能のテスト
 */

import {
  convertCategoryToHashtags,
  MigrationResult,
  MigrationProgress
} from '../migration';

// Firebase関連のモック
vi.mock('../firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  writeBatch: vi.fn(),
  getFirestore: vi.fn()
}));

describe('migration', () => {
  describe('convertCategoryToHashtags', () => {
    test('有効なカテゴリIDをハッシュタグに変換', () => {
      expect(convertCategoryToHashtags('感想')).toEqual(['感想']);
      expect(convertCategoryToHashtags('質問')).toEqual(['質問']);
      expect(convertCategoryToHashtags('応援')).toEqual(['応援']);
      expect(convertCategoryToHashtags('お知らせ')).toEqual(['お知らせ']);
    });

    test('前後の空白を除去', () => {
      expect(convertCategoryToHashtags('  感想  ')).toEqual(['感想']);
      expect(convertCategoryToHashtags('\t質問\n')).toEqual(['質問']);
    });

    test('英語カテゴリの小文字変換', () => {
      expect(convertCategoryToHashtags('FEEDBACK')).toEqual(['feedback']);
      expect(convertCategoryToHashtags('Question')).toEqual(['question']);
    });

    test('無効な入力の処理', () => {
      expect(convertCategoryToHashtags('')).toEqual([]);
      expect(convertCategoryToHashtags('   ')).toEqual([]);
      expect(convertCategoryToHashtags(null as unknown as string)).toEqual([]);
      expect(convertCategoryToHashtags(undefined as unknown as string)).toEqual([]);
    });

    test('数字を含むカテゴリ', () => {
      expect(convertCategoryToHashtags('Category1')).toEqual(['category1']);
      expect(convertCategoryToHashtags('お知らせ2024')).toEqual(['お知らせ2024']);
    });
  });

  describe('MigrationResult interface', () => {
    test('MigrationResult の構造が正しい', () => {
      const result: MigrationResult = {
        totalProcessed: 10,
        successCount: 8,
        errorCount: 2,
        errors: [
          { id: 'post1', error: 'Invalid data' },
          { id: 'post2', error: 'Network error' }
        ]
      };

      expect(result.totalProcessed).toBe(10);
      expect(result.successCount).toBe(8);
      expect(result.errorCount).toBe(2);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0]).toEqual({ id: 'post1', error: 'Invalid data' });
    });
  });

  describe('MigrationProgress interface', () => {
    test('MigrationProgress の構造が正しい', () => {
      const progress: MigrationProgress = {
        current: 5,
        total: 10,
        percentage: 50,
        currentDocId: 'doc123'
      };

      expect(progress.current).toBe(5);
      expect(progress.total).toBe(10);
      expect(progress.percentage).toBe(50);
      expect(progress.currentDocId).toBe('doc123');
    });

    test('MigrationProgress でcurrentDocIdがオプショナル', () => {
      const progress: MigrationProgress = {
        current: 3,
        total: 10,
        percentage: 30
        // currentDocId は省略可能
      };

      expect(progress.currentDocId).toBeUndefined();
    });
  });

  describe('カテゴリマッピング', () => {
    test('標準的なカテゴリの変換', () => {
      const categories = ['感想', '質問', '応援', 'お知らせ'];
      
      categories.forEach(category => {
        const result = convertCategoryToHashtags(category);
        expect(result).toEqual([category]);
        expect(result).toHaveLength(1);
      });
    });

    test('特殊文字を含むカテゴリ', () => {
      // 特殊文字は正規化で処理される
      expect(convertCategoryToHashtags('感想！')).toEqual(['感想！']);
      expect(convertCategoryToHashtags('質問？')).toEqual(['質問？']);
    });

    test('長いカテゴリ名', () => {
      const longCategory = 'とても長いカテゴリ名です';
      expect(convertCategoryToHashtags(longCategory)).toEqual([longCategory]);
    });
  });

  describe('エラーハンドリング', () => {
    test('型安全性の確認', () => {
      // TypeScriptの型チェックにより、不正な型は渡せない
      // 実行時エラーではなく、コンパイル時エラーとして検出される
      expect(convertCategoryToHashtags('valid')).toEqual(['valid']);
    });

    test('空文字列や空白のみの処理', () => {
      expect(convertCategoryToHashtags('')).toEqual([]);
      expect(convertCategoryToHashtags('   ')).toEqual([]);
      expect(convertCategoryToHashtags('\t\n\r')).toEqual([]);
    });
  });

  describe('正規化の適用', () => {
    test('normalizeHashtags が適用される', () => {
      // 英数字の小文字変換
      expect(convertCategoryToHashtags('CATEGORY')).toEqual(['category']);
      
      // 日本語は変換されない
      expect(convertCategoryToHashtags('カテゴリー')).toEqual(['カテゴリー']);
      
      // 前後の空白除去
      expect(convertCategoryToHashtags('  category  ')).toEqual(['category']);
    });

    test('重複除去（単一要素なので重複なし）', () => {
      // convertCategoryToHashtags は単一のカテゴリを処理するため、
      // 重複は発生しないが、normalizeHashtags の動作を確認
      expect(convertCategoryToHashtags('category')).toEqual(['category']);
    });
  });
});