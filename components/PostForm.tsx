"use client";

import { useState } from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import { usePosts } from '../hooks/usePosts';

interface PostFormProps {
  onPostCreated?: () => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const { user } = useAuthContext();
  const { createPost, isSubmitting, error } = usePosts();
  
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('感想');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // カテゴリオプション
  const categories = [
    { id: '感想', label: '感想' },
    { id: '質問', label: '質問' },
    { id: '応援', label: '応援' },
    { id: 'お知らせ', label: 'お知らせ' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.nickname) {
      setLocalError('ニックネームを設定してから投稿してください');
      return;
    }

    try {
      setLocalError('');
      setSuccessMessage('');
      
      await createPost({
        text,
        categoryId,
      });

      // 投稿成功時の処理
      setText('');
      setSuccessMessage('投稿が作成されました！');
      
      // 成功メッセージを3秒後に消す
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // コールバック実行
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      // エラーはusePosts内で処理される
      console.error('投稿エラー:', err);
    }
  };

  // ユーザーが認証されていない、またはニックネームが未設定の場合
  if (!user || !user.nickname) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-m text-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">掲示板に投稿する</h2>
        <div className="bg-yellow-100 text-yellow-700 p-3 rounded">
          投稿するにはニックネームを設定してください
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">掲示板に投稿する</h2>
      
      <div className="mb-4 text-sm text-gray-600">
        投稿者: <span className="font-semibold">{user.nickname}</span>
      </div>

      {(error || localError) && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {localError || error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            disabled={isSubmitting}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            投稿内容
          </label>
          <textarea
            id="text"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="感想や応援メッセージをどうぞ！"
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              {text.length}/500文字
            </p>
            {text.length > 450 && (
              <p className="text-xs text-orange-500">
                文字数制限に近づいています
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '投稿中...' : '投稿する'}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        ※ 投稿後の編集・削除はできません
      </p>
    </div>
  );
}