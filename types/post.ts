/**
 * 投稿関連の型定義
 */

import { Timestamp } from 'firebase/firestore';

// 投稿データの型定義
export interface Post {
  id: string;
  text: string;
  nickname: string;
  hashtags: string[]; // カテゴリーからハッシュタグ配列に変更
  createdAt: Timestamp | any; // Firestore Timestamp
  userId: string;
}

// 新規投稿データの型定義
export interface NewPost {
  text: string;
  hashtags?: string[]; // オプショナル - テキストから自動抽出される
}

// レガシー投稿データの型定義（移行期間中のみ使用）
export interface LegacyPost {
  id: string;
  text: string;
  nickname: string;
  categoryId: string; // 旧カテゴリーフィールド
  createdAt: Timestamp | any;
  userId: string;
}