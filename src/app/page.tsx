"use client";

import { useState, useEffect, use } from 'react';
import AuthTest from '../../components/AuthTest';
import NicknameForm from '../../components/NicknameForm';
import PostForm from '../../components/PostForm';

type Post = {
  id: number;
  nickname: string;
  body: string;
  category: string;
  created_at: string;
  is_official: number; // 0 or 1
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch posts from the API
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('データの取得に失敗しました。');
      }
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '不明なエラーが発生しました。';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);



  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            文化祭掲示板
          </h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ニックネーム登録フォーム */}
        <NicknameForm />

        {/* Firebase認証テスト用コンポーネント */}
        <div className="mb-8">
          <AuthTest />
        </div>

        {/* 投稿フォーム */}
        <div className="mb-8">
          <PostForm />
        </div>

        <div className='text-gray-900'>
          <h2 className="text-xl font-semibold mb-4">投稿一覧</h2>
          {isLoading ? (
            <p>読み込み中...</p>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className={`bg-white p-4 rounded-lg shadow-md ${post.is_official ? 'bg-blue-50 border-l-4 border-blue-500 rounded-l-lg' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center flex-wrap">
                      <p className={`font-semibold ${post.is_official ? 'text-blue-800' : 'text-gray-800'}`}>{post.nickname}</p>
                      <span className="ml-3 mt-1 sm:mt-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{post.category}</span>
                    </div>
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-2 text-right">{new Date(post.created_at).toLocaleString('ja-JP')}</span>
                  </div>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">{post.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
