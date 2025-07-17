import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
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
  const { user } = useAuthContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // リアルタイムで投稿一覧を取得
  useEffect(() => {
    console.log('投稿リスナー開始');
    setIsLoading(true);
    
    // 投稿を作成日時の降順（新しい順）で取得するクエリ
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    // リアルタイムリスナーを設定
    const unsubscribe = onSnapshot(
      postsQuery,
      (querySnapshot) => {
        console.log('投稿データ更新:', querySnapshot.size, '件');
        const postsData: Post[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          postsData.push({
            id: doc.id,
            text: data.text,
            nickname: data.nickname,
            categoryId: data.categoryId,
            createdAt: data.createdAt,
            userId: data.userId,
          });
        });
        
        setPosts(postsData);
        setIsLoading(false);
        console.log('投稿一覧更新完了:', postsData.length, '件');
      },
      (err) => {
        console.error('投稿取得エラー:', err);
        setError(`投稿の取得に失敗しました: ${err.message}`);
        setIsLoading(false);
      }
    );

    // クリーンアップ関数
    return () => {
      console.log('投稿リスナー停止');
      unsubscribe();
    };
  }, []);

  return {
    posts,
    createPost,
    isSubmitting,
    isLoading,
    error,
  };
}