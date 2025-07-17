import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthContext } from './AuthContext';

// 投稿データの型定義
export interface Post {
  id: string;
  text: string;
  nickname: string;
  categoryId: string;
  createdAt: any; // Firestore Timestamp
  userId: string;
}

// 新規投稿データの型定義
export interface NewPost {
  text: string;
  categoryId: string;
}

export function usePosts() {
  const { user } = useAuthContext() 
;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 投稿を作成する関数
  const createPost = async (postData: NewPost): Promise<void> => {
    if (!user || !user.nickname) {
      throw new Error('ユーザーが認証されていないか、ニックネームが設定されていません');
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 入力バリデーション
      if (!postData.text.trim()) {
        throw new Error('投稿内容を入力してください');
      }

      if (postData.text.length > 500) {
        throw new Error('投稿は500文字以内で入力してください');
      }

      if (!postData.categoryId) {
        throw new Error('カテゴリを選択してください');
      }

      // Firestoreのpostsコレクションに新しい投稿を追加
      const docRef = await addDoc(collection(db, 'posts'), {
        text: postData.text.trim(),
        nickname: user.nickname,
        categoryId: postData.categoryId,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });

      console.log('投稿が作成されました。ID:', docRef.id);
    } catch (err) {
      console.error('投稿作成エラー:', err);
      const errorMessage = err instanceof Error ? err.message : '投稿の作成に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createPost,
    isSubmitting,
    error,
  };
}