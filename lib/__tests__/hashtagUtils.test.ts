/**
 * ハッシュタグユーティリティ関数のテスト
 */

import {
  extractHashtags,
  normalizeHashtags,
  normalizeHashtag,
  validateHashtags,
  validateHashtag,
  processHashtagsFromText,
  HASHTAG_LIMITS
} from '../hashtagUtils';

describe('hashtagUtils', () => {
  describe('extractHashtags', () => {
    test('基本的なハッシュタグ抽出', () => {
      const text = '今日は文化祭で楽しかった！ #文化祭 #楽しい #感想';
      const result = extractHashtags(text);
      expect(result).toEqual(['文化祭', '楽しい', '感想']);
    });

    test('英語と日本語の混在ハッシュタグ', () => {
      const text = 'Great festival! #festival #文化祭 #Fun #楽しい';
      const result = extractHashtags(text);
      expect(result).toEqual(['festival', '文化祭', 'fun', '楽しい']);
    });

    test('数字を含むハッシュタグ', () => {
      const text = '2024年の文化祭 #文化祭2024 #2024festival';
      const result = extractHashtags(text);
      expect(result).toEqual(['文化祭2024', '2024festival']);
    });

    test('重複するハッシュタグの除去', () => {
      const text = '#楽しい #文化祭 #楽しい #festival #Festival';
      const result = extractHashtags(text);
      expect(result).toEqual(['楽しい', '文化祭', 'festival']);
    });

    test('ハッシュタグがない場合', () => {
      const text = '今日は楽しかった！';
      const result = extractHashtags(text);
      expect(result).toEqual([]);
    });

    test('空文字列の場合', () => {
      const result = extractHashtags('');
      expect(result).toEqual([]);
    });

    test('nullやundefinedの場合', () => {
      expect(extractHashtags(null as unknown as string)).toEqual([]);
      expect(extractHashtags(undefined as unknown as string)).toEqual([]);
    });

    test('句読点で区切られたハッシュタグ', () => {
      const text = '#文化祭、#楽しい。#感想！#質問？';
      const result = extractHashtags(text);
      expect(result).toEqual(['文化祭', '楽しい', '感想', '質問']);
    });
  });

  describe('normalizeHashtag', () => {
    test('英数字の小文字変換', () => {
      expect(normalizeHashtag('Festival')).toBe('festival');
      expect(normalizeHashtag('Fun123')).toBe('fun123');
    });

    test('日本語は変換されない', () => {
      expect(normalizeHashtag('文化祭')).toBe('文化祭');
      expect(normalizeHashtag('楽しい')).toBe('楽しい');
    });

    test('前後の空白除去', () => {
      expect(normalizeHashtag('  festival  ')).toBe('festival');
      expect(normalizeHashtag('  文化祭  ')).toBe('文化祭');
    });

    test('先頭の#除去', () => {
      expect(normalizeHashtag('#festival')).toBe('festival');
      expect(normalizeHashtag('#文化祭')).toBe('文化祭');
    });

    test('空文字列やnullの処理', () => {
      expect(normalizeHashtag('')).toBe('');
      expect(normalizeHashtag(null as unknown as string)).toBe('');
      expect(normalizeHashtag(undefined as unknown as string)).toBe('');
    });
  });

  describe('normalizeHashtags', () => {
    test('配列の正規化と重複除去', () => {
      const hashtags = ['Festival', 'festival', '文化祭', '  楽しい  ', '#感想'];
      const result = normalizeHashtags(hashtags);
      expect(result).toEqual(['festival', '文化祭', '楽しい', '感想']);
    });

    test('空文字列の除去', () => {
      const hashtags = ['festival', '', '文化祭', '   ', '#'];
      const result = normalizeHashtags(hashtags);
      expect(result).toEqual(['festival', '文化祭']);
    });

    test('配列でない場合', () => {
      expect(normalizeHashtags(null as unknown as string[])).toEqual([]);
      expect(normalizeHashtags('not array' as unknown as string[])).toEqual([]);
    });
  });

  describe('validateHashtags', () => {
    test('有効なハッシュタグ配列', () => {
      const hashtags = ['文化祭', '楽しい', 'festival'];
      const result = validateHashtags(hashtags);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('数量制限超過', () => {
      const hashtags = Array(HASHTAG_LIMITS.MAX_COUNT + 1).fill('test');
      const result = validateHashtags(hashtags);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(`ハッシュタグは最大${HASHTAG_LIMITS.MAX_COUNT}個までです`);
    });

    test('長さ制限超過', () => {
      const longHashtag = 'a'.repeat(HASHTAG_LIMITS.MAX_LENGTH + 1);
      const hashtags = [longHashtag];
      const result = validateHashtags(hashtags);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(`ハッシュタグ1は最大${HASHTAG_LIMITS.MAX_LENGTH}文字までです`);
    });

    test('空文字列を含む場合', () => {
      const hashtags = ['valid', '', 'another'];
      const result = validateHashtags(hashtags);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ハッシュタグ2は空文字列にできません');
    });

    test('文字列でない要素を含む場合', () => {
      const hashtags = ['valid', 123, 'another'] as unknown as string[];
      const result = validateHashtags(hashtags);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ハッシュタグ2は文字列である必要があります');
    });

    test('配列でない場合', () => {
      const result = validateHashtags('not array' as unknown as string[]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ハッシュタグは配列である必要があります');
    });
  });

  describe('validateHashtag', () => {
    test('有効なハッシュタグ', () => {
      const result = validateHashtag('文化祭');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('長さ制限超過', () => {
      const longHashtag = 'a'.repeat(HASHTAG_LIMITS.MAX_LENGTH + 1);
      const result = validateHashtag(longHashtag);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`ハッシュタグは最大${HASHTAG_LIMITS.MAX_LENGTH}文字までです`);
    });

    test('空文字列', () => {
      const result = validateHashtag('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ハッシュタグは空文字列にできません');
    });

    test('文字列でない場合', () => {
      const result = validateHashtag(123 as unknown as string);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('ハッシュタグは文字列である必要があります');
    });
  });

  describe('processHashtagsFromText', () => {
    test('正常なテキスト処理', () => {
      const text = '今日は楽しかった！ #文化祭 #楽しい #感想';
      const result = processHashtagsFromText(text);
      expect(result.hashtags).toEqual(['文化祭', '楽しい', '感想']);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('制限を超えるハッシュタグ', () => {
      const manyHashtags = Array(HASHTAG_LIMITS.MAX_COUNT + 1)
        .fill(0)
        .map((_, i) => `#tag${i}`)
        .join(' ');
      const result = processHashtagsFromText(manyHashtags);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('ハッシュタグがないテキスト', () => {
      const text = '今日は楽しかった！';
      const result = processHashtagsFromText(text);
      expect(result.hashtags).toEqual([]);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});