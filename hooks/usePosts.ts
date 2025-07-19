import { useState, useEffect, useCallback } from 'react';
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
import { Post, NewPost, LegacyPost } from '../types/post';
import { extractHashtags, validateHashtags } from '../lib/hashtagUtils';

export function usePosts() {
  const { user } = useAuthContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ハッシュタグによるフィルタリング関数
  const filterByHashtag = (hashtag: string | null) => {
    setCurrentFilter(hashtag);
    if (!hashtag || hashtag.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const normalizedFilter = hashtag.toLowerCase().trim();
      const filtered = posts.filter(post => 
        post.hashtags.some(tag => 
          tag.toLowerCase().includes(normalizedFilter)
        )
      );
      setFilteredPosts(filtered);
    }
  };

  // 複数のハッシュタグでフィルタリング
  const filterByHashtags = (hashtags: string[]) => {
    if (!hashtags || hashtags.length === 0) {
      setFilteredPosts(posts);
      setCurrentFilter(null);
    } else {
      const normalizedFilters = hashtags.map(tag => tag.toLowerCase().trim());
      const filtered = posts.filter(post => 
        normalizedFilters.every(filter =>
          post.hashtags.some(tag => 
            tag.toLowerCase().includes(filter)
          )
        )
      );
      setFilteredPosts(filtered);
      setCurrentFilter(hashtags.join(', '));
    }
  };

  // フィルターをクリア（最適化版）
  const clearFilter = useCallback(() => {
    setCurrentFilter(null);
    // 大量データの場合は非同期処理
    if (posts.length > 50) {
      setTimeout(() => setFilteredPosts(posts), 0);
    } else {
      setFilteredPosts(posts);
    }
  }, [posts]);

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

      // ネットワーク接続チェック
      if (!navigator.onLine) {
        setError('インターネット接続がありません。ネットワーク接続を確認してください。');
        throw new Error('インターネット接続がありません');
      }

      // テキストからハッシュタグを抽出
      const extractedHashtags = extractHashtags(postData.text);
      
      // 明示的に指定されたハッシュタグがあれば追加
      let allHashtags: string[] = [];
      if (postData.hashtags && postData.hashtags.length > 0) {
        // 明示的なハッシュタグと抽出されたハッシュタグを結合
        allHashtags = [...extractedHashtags, ...postData.hashtags];
      } else {
        allHashtags = extractedHashtags;
      }

      // ハッシュタグのバリデーション
      const validation = validateHashtags(allHashtags);
      if (!validation.isValid) {
        setError(`ハッシュタグエラー: ${validation.errors.join(', ')}`);
        throw new Error(`ハッシュタグエラー: ${validation.errors.join(', ')}`);
      }

      console.log('投稿作成:', {
        text: postData.text,
        extractedHashtags,
        explicitHashtags: postData.hashtags || [],
        finalHashtags: allHashtags
      });

      try {
        // Firestoreのpostsコレクションに新しい投稿を追加
        const docRef = await addDoc(collection(db, 'posts'), {
          text: postData.text.trim(),
          nickname: user.nickname,
          hashtags: allHashtags,
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
            if (!data.text || !data.nickname) {
              console.warn('不完全なデータをスキップ:', doc.id);
              return;
            }
            
            // ハッシュタグデータの処理（レガシーデータ対応）
            let hashtags: string[] = [];
            if (data.hashtags && Array.isArray(data.hashtags) && data.hashtags.length > 0) {
              // 新しいハッシュタグ形式
              hashtags = data.hashtags.filter((tag: unknown) => 
                typeof tag === 'string' && tag.trim().length > 0
              );
            } else if (data.categoryId && typeof data.categoryId === 'string') {
              // レガシーカテゴリIDをハッシュタグに変換
              hashtags = [data.categoryId.trim()];
              console.log(`レガシーデータ変換: ${data.categoryId} → [${hashtags.join(', ')}]`);
            }
            
            postsData.push({
              id: doc.id,
              text: data.text,
              nickname: data.nickname,
              hashtags: hashtags,
              createdAt: data.createdAt,
              userId: data.userId || 'unknown',
            });
          });
          
          setPosts(postsData);
          setFilteredPosts(postsData); // 初期状態では全投稿を表示
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

  // フィルタリング状態が変更されたときの処理
  useEffect(() => {
    filterByHashtag(currentFilter);
  }, [posts, currentFilter]);

  return {
    posts,
    filteredPosts,
    createPost,
    filterByHashtag,
    filterByHashtags,
    clearFilter,
    currentFilter,
    isSubmitting,
    isLoading,
    error,
  };
}