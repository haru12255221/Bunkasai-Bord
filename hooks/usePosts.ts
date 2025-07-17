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
      setError('ユーザーが認証されていないか、ニックネームが設定されていません');
      throw new Error('ユーザーが認証されていないか、ニックネームが設定されていません');
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 入力バリデーション
      if (!postData.text.trim()) {
        setError('投稿内容を入力してください');
        throw new Error('投稿内容を入力してください');
      }

      if (postData.text.length > 500) {
        setError('投稿は500文字以内で入力してください');
        throw new Error('投稿は500文字以内で入力してください');
      }

      if (!postData.categoryId) {
        setError('カテゴリを選択してください');
        throw new Error('カテゴリを選択してください');
      }

      // ネットワーク接続チェック
      if (!navigator.onLine) {
        setError('インターネット接続がありません。ネットワーク接続を確認してください。');
        throw new Error('インターネット接続がありません');
      }

      try {
        // Firestoreのpostsコレクションに新しい投稿を追加
        const docRef = await addDoc(collection(db, 'posts'), {
          text: postData.text.trim(),
          nickname: user.nickname,
          categoryId: postData.categoryId,
          createdAt: serverTimestamp(),
          userId: user.uid,
        });

        console.log('投稿が作成されました。ID:', docRef.id);
      } catch (firestoreErr: any) {
        console.error('Firestore書き込みエラー:', firestoreErr);
        
        // Firestoreエラーコードに基づいたユーザーフレンドリーなメッセージ
        if (firestoreErr.code === 'permission-denied') {
          setError('投稿する権限がありません。ログインし直してください。');
        } else if (firestoreErr.code === 'unavailable') {
          setError('サーバーに接続できません。インターネット接続を確認してください。');
        } else {
          setError(`投稿の作成に失敗しました: ${firestoreErr.message || '不明なエラー'}`);
        }
        
        throw firestoreErr;
      }
    } catch (err) {
      console.error('投稿作成エラー:', err);
      const errorMessage = err instanceof Error ? err.message : '投稿の作成に失敗しました';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ネットワーク状態の監視
  useEffect(() => {
    const handleOnline = () => {
      console.log('ネットワーク接続が復旧しました');
      setError(null);
      // 再接続時に自動的にリロード
      window.location.reload();
    };
    
    const handleOffline = () => {
      console.error('ネットワーク接続が切断されました');
      setError('インターネット接続がありません。ネットワーク接続を確認してください。');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // リアルタイムで投稿一覧を取得
  useEffect(() => {
    console.log('投稿リスナー開始');
    setIsLoading(true);
    setError(null);
    
    // 初期ネットワーク接続チェック
    if (!navigator.onLine) {
      console.error('ネットワーク接続がありません');
      setError('インターネット接続がありません。ネットワーク接続を確認してください。');
      setIsLoading(false);
      return; // リスナーを設定せずに終了
    }
    
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
        
        try {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // データの検証
            if (!data.text || !data.nickname || !data.categoryId) {
              console.warn('不完全なデータをスキップ:', doc.id);
              return;
            }
            
            postsData.push({
              id: doc.id,
              text: data.text,
              nickname: data.nickname,
              categoryId: data.categoryId,
              createdAt: data.createdAt,
              userId: data.userId || 'unknown',
            });
          });
          
          setPosts(postsData);
          setError(null);
          console.log('投稿一覧更新完了:', postsData.length, '件');
        } catch (parseErr) {
          console.error('投稿データの解析エラー:', parseErr);
          setError('投稿データの解析中にエラーが発生しました');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('投稿取得エラー:', err);
        
        // エラーコードに基づいたユーザーフレンドリーなメッセージ
        if (err.code === 'permission-denied') {
          setError('投稿を閲覧する権限がありません。ログインし直してください。');
        } else if (err.code === 'unavailable') {
          setError('サーバーに接続できません。インターネット接続を確認してください。');
        } else {
          setError(`投稿の取得に失敗しました: ${err.message || '不明なエラー'}`);
        }
        
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