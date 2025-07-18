"use client";

import { useState } from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import { checkNicknameAvailability } from '../hooks/useAuth';


interface NicknameFormProps {
  onComplete?: () => void;
}

export default function NicknameForm({ onComplete }: NicknameFormProps) {
  const { user, setNickname, setNicknameDirectly, error } = useAuthContext();
  const [nickname, setNicknameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [adjustedNickname, setAdjustedNickname] = useState<string | null>(null);

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
      const originalNickname = nickname.trim();

      // 重複チェックを実行
      const checkedNickname = await checkNicknameAvailability(originalNickname);

      if (checkedNickname !== originalNickname) {
        // 重複があった場合、確認モーダルを表示
        setAdjustedNickname(checkedNickname);
        setShowConfirmModal(true);
        setIsSubmitting(false);
        return;
      }

      // 重複なしの場合、そのまま登録
      await setNickname(originalNickname);
      setIsCompleted(true);
      if (onComplete) onComplete();
    } catch {
      setLocalError('ニックネームの設定に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // モーダルでOKを押したときの処理
  const handleConfirm = async () => {
    if (!adjustedNickname) return;
    try {
      setIsSubmitting(true);
      setLocalError('');

      console.log('確認モーダル: ニックネーム設定開始', adjustedNickname);

      // 重複チェック済みのニックネームを直接設定
      await setNicknameDirectly(adjustedNickname);

      console.log('確認モーダル: ニックネーム設定完了', adjustedNickname);

      // 状態更新を確実にするため少し待機
      await new Promise(resolve => setTimeout(resolve, 300));

      setIsCompleted(true);
      setShowConfirmModal(false);
      if (onComplete) onComplete();
    } catch (err) {
      console.error('ニックネーム設定エラー:', err);
      setLocalError('ニックネームの設定に失敗しました');
      setShowConfirmModal(false); // エラー時もモーダルを閉じる
    } finally {
      setIsSubmitting(false);
    }
  };

  // モーダルでキャンセルを押したときの処理
  const handleCancel = () => {
    setShowConfirmModal(false);
    setAdjustedNickname(null);
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



        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              ニックネーム
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNicknameInput(e.target.value)}
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

      {/* 重複時の確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 text-center">
            <h3 className="text-lg font-semibold mb-4">ニックネーム重複の確認</h3>
            <p className="mb-4">
              入力したニックネームは既に使われています。<br />
              <span className="font-bold text-indigo-600">{adjustedNickname}</span> で登録してもよろしいですか？
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleConfirm}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? '設定中...' : 'OK'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                disabled={isSubmitting}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}