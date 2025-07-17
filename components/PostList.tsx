"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// 投稿データの型定義
interface Post {
  id: string;
  text: string;
  nickname: string;
  categoryId: string;
  createdAt: Timestamp;
  userId: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('PostList: リアルタイムリスナーを設定中...');
    
    // Firestoreのpostsコレクションをリアルタイムで監視
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc') // 新しい順でソート
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log('PostList: データ更新を受信:', querySnapshot.size, '件');
        
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
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('PostList: リアルタイムリスナーエラー:', err);
        setError('投稿の取得に失敗しました');
        setLoading(false);
      }
    );

    // クリーンアップ関数
    return () => {
      console.log('PostList: リアルタイムリスナーを解除');
      unsubscribe();
    };
  }, []);

  // 日時をフォーマットする関数
  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '日時不明';
    
    try {
      const date = timestamp.toDate();
      return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      console.error('日時フォーマットエラー:', err);
      return '日時不明';
    }
  };

  // カテゴリのスタイルを取得する関数
  const getCategoryStyle = (categoryId: string) => {
    const styles = {
      '感想': 'bg-blue-100 text-blue-800',
      '質問': 'bg-green-100 text-green-800',
      '応援': 'bg-yellow-100 text-yellow-800',
      'お知らせ': 'bg-red-100 text-red-800',
    };
    return styles[categoryId as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">投稿一覧</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">投稿を読み込み中...</p>
          <p className="text-gray-500 text-sm mt-2">しばらくお待ちください</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">投稿一覧</h2>
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">投稿の読み込みに失敗しました</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">投稿一覧</h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.436L3 21l2.436-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">まだ投稿がありません</h3>
          <p className="text-gray-600 mb-4">文化祭の感想や応援メッセージを投稿してみましょう！</p>
          <div className="text-sm text-gray-500">
            <p>💭 感想を共有</p>
            <p>❓ 質問を投稿</p>
            <p>📣 応援メッセージ</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-800">
                    {post.nickname}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(post.categoryId)}`}>
                    {post.categoryId}
                  </span>
                </div>
                <span className="text-sm text-gray-500 flex-shrink-0">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {post.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}