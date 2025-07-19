/**
 * ハッシュタグユーティリティ関数
 * テキストからハッシュタグを抽出、正規化、バリデーションを行う
 */

// ハッシュタグの制限値
export const HASHTAG_LIMITS = {
  MAX_LENGTH: 50,
  MAX_COUNT: 10,
} as const;

/**
 * テキストからハッシュタグを抽出する
 * @param text - 抽出対象のテキスト
 * @returns 抽出されたハッシュタグの配列
 */
export function extractHashtags(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // ハッシュタグの正規表現パターン
  // #で始まり、日本語、英語、数字を含む文字列をマッチ
  // スペース、改行、句読点で区切られる
  const hashtagRegex = /#([^\s#\n\r\t.,!?;:()[\]{}「」『』。、！？；：（）［］｛｝]+)/g;
  
  const matches = text.match(hashtagRegex);
  
  if (!matches) {
    return [];
  }

  // #を除去してハッシュタグのみを取得
  const hashtags = matches.map(match => match.substring(1));
  
  // 正規化を適用
  return normalizeHashtags(hashtags);
}

/**
 * ハッシュタグを正規化する
 * @param hashtags - 正規化対象のハッシュタグ配列
 * @returns 正規化されたハッシュタグ配列
 */
export function normalizeHashtags(hashtags: string[]): string[] {
  if (!Array.isArray(hashtags)) {
    return [];
  }

  return hashtags
    .map(hashtag => normalizeHashtag(hashtag))
    .filter(hashtag => hashtag.length > 0)
    .filter((hashtag, index, array) => array.indexOf(hashtag) === index); // 重複除去
}

/**
 * 単一のハッシュタグを正規化する
 * @param hashtag - 正規化対象のハッシュタグ
 * @returns 正規化されたハッシュタグ
 */
export function normalizeHashtag(hashtag: string): string {
  if (!hashtag || typeof hashtag !== 'string') {
    return '';
  }

  // 前後の空白を除去
  let normalized = hashtag.trim();
  
  // 先頭の#を除去（もしあれば）
  if (normalized.startsWith('#')) {
    normalized = normalized.substring(1);
  }
  
  // 英数字のみ小文字に変換（日本語は変換しない）
  normalized = normalized.replace(/[A-Za-z0-9]/g, (match) => match.toLowerCase());
  
  return normalized;
}

/**
 * ハッシュタグ配列のバリデーションを行う
 * @param hashtags - バリデーション対象のハッシュタグ配列
 * @returns バリデーション結果
 */
export function validateHashtags(hashtags: string[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 配列かどうかのチェック
  if (!Array.isArray(hashtags)) {
    errors.push('ハッシュタグは配列である必要があります');
    return { isValid: false, errors };
  }

  // 数量制限のチェック
  if (hashtags.length > HASHTAG_LIMITS.MAX_COUNT) {
    errors.push(`ハッシュタグは最大${HASHTAG_LIMITS.MAX_COUNT}個までです`);
  }

  // 各ハッシュタグの長さチェック
  hashtags.forEach((hashtag, index) => {
    if (typeof hashtag !== 'string') {
      errors.push(`ハッシュタグ${index + 1}は文字列である必要があります`);
      return;
    }

    if (hashtag.length === 0) {
      errors.push(`ハッシュタグ${index + 1}は空文字列にできません`);
      return;
    }

    if (hashtag.length > HASHTAG_LIMITS.MAX_LENGTH) {
      errors.push(`ハッシュタグ${index + 1}は最大${HASHTAG_LIMITS.MAX_LENGTH}文字までです`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 単一のハッシュタグのバリデーションを行う
 * @param hashtag - バリデーション対象のハッシュタグ
 * @returns バリデーション結果
 */
export function validateHashtag(hashtag: string): {
  isValid: boolean;
  error?: string;
} {
  if (typeof hashtag !== 'string') {
    return { isValid: false, error: 'ハッシュタグは文字列である必要があります' };
  }

  if (hashtag.length === 0) {
    return { isValid: false, error: 'ハッシュタグは空文字列にできません' };
  }

  if (hashtag.length > HASHTAG_LIMITS.MAX_LENGTH) {
    return { isValid: false, error: `ハッシュタグは最大${HASHTAG_LIMITS.MAX_LENGTH}文字までです` };
  }

  return { isValid: true };
}

/**
 * テキストからハッシュタグを抽出し、正規化とバリデーションを行う
 * @param text - 処理対象のテキスト
 * @returns 処理結果
 */
export function processHashtagsFromText(text: string): {
  hashtags: string[];
  isValid: boolean;
  errors: string[];
} {
  const extractedHashtags = extractHashtags(text);
  const validation = validateHashtags(extractedHashtags);

  return {
    hashtags: extractedHashtags,
    isValid: validation.isValid,
    errors: validation.errors
  };
}