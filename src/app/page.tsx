"use client";

import AuthTest from '../../components/AuthTest';
import NicknameForm from '../../components/NicknameForm';
import PostForm from '../../components/PostForm';
import PostList from '../../components/PostList';

export default function Home() {



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

        {/* 投稿一覧 */}
        <div className="mb-8">
          <PostList />
        </div>
      </main>
    </div>
  );
}
