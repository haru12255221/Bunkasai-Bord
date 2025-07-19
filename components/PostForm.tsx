"use client";

import { useState, useMemo } from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import { usePosts } from '../hooks/usePosts';
import { NewPost } from '../types/post';
import { HashtagPreview } from './HashtagHighlighter';
import { extractHashtags } from '../lib/hashtagUtils';
import { useHashtags } from '../hooks/useHashtags';

interface PostFormProps {
  onPostCreated?: () => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const { user } = useAuthContext();
  const { createPost, isSubmitting, error } = usePosts();
  const { validateHashtag } = useHashtags();

  const [text, setText] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [customHashtag, setCustomHashtag] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // リアルタイムでハッシュタグを抽出
  const extractedHashtags = useMemo(() => {
    return extractHashtags(text);
  }, [text]);

  // 全てのハッシュタグ（抽出 + 選択 + カスタム）
  const allHashtags = useMemo(() => {
    const combined = [...extractedHashtags, ...selectedHashtags];
    if (customHashtag.trim()) {
      combined.push(customHashtag.trim());
    }
    // 重複除去
    return Array.from(new Set(combined));
  }, [extractedHashtags, selectedHashtags, customHashtag]);

  // デフォルトハッシュタグオプション（旧カテゴリー）
  const defaultHashtags = [
    { id: '感想', label: '感想' },
    { id: '質問', label: '質問' },
    { id: '応援', label: '応援' },
    { id: 'お知らせ', label: 'お知らせ' },
  ];

  // ハッシュタグの追加/削除
  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(tag => tag !== hashtag)
        : [...prev, hashtag]
    );
  };

  // カスタムハッシュタグの追加
  const addCustomHashtag = () => {
    const validation = validateHashtag(customHashtag, selectedHashtags, extractedHashtags);

    if (!validation.isValid) {
      if (validation.error) {
        setLocalError(validation.error);
        setTimeout(() => setLocalError(''), 3000);
      }
      return;
    }

    setSelectedHashtags(prev => [...prev, customHashtag.trim()]);
    setCustomHashtag('');
  };

  // ハッシュタグの削除
  const removeHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => prev.filter(tag => tag !== hashtag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.nickname) {
      setLocalError('ニックネームを設定してから投稿してください');
      return;
    }

    try {
      setLocalError('');
      setSuccessMessage('');

      // ネットワーク接続チェック
      if (!navigator.onLine) {
        setLocalError('インターネット接続がありません。ネットワーク接続を確認してください。');
        return;
      }

      const postData: NewPost = {
        text,
        hashtags: selectedHashtags.length > 0 ? selectedHashtags : undefined,
      };

      await createPost(postData);

      // 投稿成功時の処理
      setText('');
      setSelectedHashtags([]);
      setCustomHashtag('');
      setSuccessMessage('投稿が作成されました！');

      // 成功メッセージを3秒後に消す
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // コールバック実行（PostListは自動的にリアルタイム更新される）
      if (onPostCreated) {
        onPostCreated();
      }

      console.log('投稿作成完了 - PostListが自動更新されます');
    } catch (err: unknown) {
      // エラーメッセージをユーザーフレンドリーに表示
      console.error('投稿エラー:', err);

      // エラーオブジェクトの型を確認
      if (typeof err === 'object' && err !== null) {
        // Firebaseエラーの場合
        const firebaseErr = err as { code?: string; message?: string };

        if (firebaseErr.code === 'permission-denied') {
          setLocalError('投稿する権限がありません。ログインし直してください。');
        } else if (firebaseErr.code === 'unavailable') {
          setLocalError('サーバーに接続できません。インターネット接続を確認してください。');
        } else if (firebaseErr.message) {
          setLocalError(firebaseErr.message);
        } else {
          setLocalError('投稿の作成に失敗しました。もう一度お試しください。');
        }
      } else {
        setLocalError('投稿の作成に失敗しました。もう一度お試しください。');
      }

      // ネットワークエラー以外の場合のみ、自動的にエラーメッセージを消す（10秒後）
      if (typeof err === 'object' && err !== null) {
        const errorObj = err as { message?: string };
        if (typeof errorObj.message === 'string' && !errorObj.message.includes('インターネット接続がありません')) {
          setTimeout(() => {
            setLocalError('');
          }, 10000);
        }
      } else {
        setTimeout(() => {
          setLocalError('');
        }, 10000);
      }
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
              <p className="text-xs text-green-600 mt-1">
                投稿がタイムラインに表示されました
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ハッシュタグ
          </label>

          {/* デフォルトハッシュタグ選択 */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-2">よく使われるハッシュタグ:</div>
            <div className="flex flex-wrap gap-2">
              {defaultHashtags.map((hashtag) => (
                <button
                  key={hashtag.id}
                  type="button"
                  onClick={() => toggleHashtag(hashtag.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedHashtags.includes(hashtag.id)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  disabled={isSubmitting}
                >
                  #{hashtag.label}
                </button>
              ))}
            </div>
          </div>

          {/* カスタムハッシュタグ入力 */}
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-2">カスタムハッシュタグを追加:</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customHashtag}
                onChange={(e) => setCustomHashtag(e.target.value)}
                placeholder="ハッシュタグを入力（#なしで）"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                disabled={isSubmitting}
                maxLength={50}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomHashtag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomHashtag}
                disabled={!customHashtag.trim() || isSubmitting || allHashtags.length >= 10}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                追加
              </button>
            </div>
            {customHashtag.trim() && (
              <div className="text-xs text-gray-500 mt-1">
                {selectedHashtags.includes(customHashtag.trim()) && (
                  <span className="text-orange-600">⚠ 既に選択済み</span>
                )}
                {extractedHashtags.includes(customHashtag.trim()) && (
                  <span className="text-blue-600">ℹ テキストから自動抽出されます</span>
                )}
                {allHashtags.length >= 11 && (
                  <span className="text-red-600">⚠ ハッシュタグ上限に達しています</span>
                )}
              </div>
            )}
          </div>

          {/* 選択されたハッシュタグ表示 */}
          {selectedHashtags.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-2">選択中のハッシュタグ:</div>
              <div className="flex flex-wrap gap-2">
                {selectedHashtags.map((hashtag) => (
                  <span
                    key={hashtag}
                    className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    #{hashtag}
                    <button
                      type="button"
                      onClick={() => removeHashtag(hashtag)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            テキスト内の#で始まる単語も自動的にハッシュタグとして認識されます
          </p>
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            投稿内容
          </label>
          <textarea
            id="text"
            rows={4}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="感想や応援メッセージをどうぞ！ #ハッシュタグも使えます"
            maxLength={500}
            disabled={isSubmitting}
          />

          {/* リアルタイムハッシュタグプレビュー */}
          <HashtagPreview text={text} />

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

          {/* 全ハッシュタグのサマリー */}
          {allHashtags.length > 0 && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-600 mb-1">
                この投稿に含まれるハッシュタグ ({allHashtags.length}/10):
              </div>
              <div className="flex flex-wrap gap-1">
                {allHashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
              {allHashtags.length > 10 && (
                <p className="text-xs text-red-500 mt-1">
                  ハッシュタグは最大10個までです
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              投稿中...
            </>
          ) : (
            '投稿する'
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        ※ 投稿後の編集・削除はできません
      </p>
    </div>
  );
}