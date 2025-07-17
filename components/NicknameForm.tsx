"use client";

import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/AuthContext';

interface NicknameFormProps {
  onComplete?: () => void;
}

export default function NicknameForm({ onComplete }: NicknameFormProps) {
  const { user, setNickname, error } = useAuthContext() 
;
  const [nickname, setNicknameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [adjustmentMessage, setAdjustmentMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim()) {
      setLocalError('ニックネームを入力してください');
      return;
    }

    if (nickname.length > 20) {
      setLocalError('ニックネームは20文字以内で入力してください');
      return;
    }

    try {
      setIsSubmitting(true);
      setLocalError('');
      setAdjustmentMessage('');
      
      const originalNickname = nickname.trim();
      await setNickname(originalNickname);
      
      console.log('ニックネーム設定完了、ユーザー状態確認:', user);
      
      // 成功フラグを設定
      setIsCompleted(true);
      
      // 成功時のコールバック
      if (onComplete) {
        onComplete();
      }
      
    } catch (err) {
      console.error('ニックネーム設定エラー:', err);
      setLocalError('ニックネームの設定に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 認証されていない場合、またはニックネーム設定済み、または設定完了の場合は何も表示しない
  if (!user || user.nickname || isCompleted) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-center">ニックネームを設定してください</h2>
        
        <p className="text-gray-600 text-sm mb-4 text-center">
          掲示板に投稿するためのニックネームを入力してください。<br />
          同じニックネームが既に使用されている場合、自動的に調整されます。
        </p>

        {(error || localError) && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {localError || error}
          </div>
        )}

        {adjustmentMessage && (
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4 text-sm">
            {adjustmentMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNicknameInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="例: 田中太郎"
              maxLength={20}
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              {nickname.length}/20文字
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !nickname.trim()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? '設定中...' : 'ニックネームを設定'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          ※ ニックネームは後から変更できません
        </p>
      </div>
    </div>
  );
}