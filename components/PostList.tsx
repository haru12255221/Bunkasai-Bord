"use client";

import { usePosts } from '../hooks/usePosts';
import PostContent, { HashtagBadges, FilterStatus } from './PostContent';
import { getPopularHashtags } from '../lib/hashtagStats';
import HashtagSearch from './HashtagSearch';
import { useMemo } from 'react';

export default function PostList() {
  const { 
    posts: allPosts, 
    filteredPosts: posts, 
    isLoading: loading, 
    error, 
    filterByHashtag, 
    clearFilter,
    currentFilter 
  } = usePosts();

  // 日時をフォーマットする関数
  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '日時不明';
    
    try {
      let date: Date;
      if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp) {
        // Firestore Timestamp
        date = (timestamp as { toDate: () => Date }).toDate();
      } else {
        // その他の形式
        date = new Date(timestamp as string | number | Date);
      }
      
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

  // ハッシュタグクリック処理（メモ化）
  const handleHashtagClick = useMemo(() => (hashtag: string) => {
    if (currentFilter === hashtag) {
      clearFilter(); // 同じハッシュタグをクリックした場合はフィルターを解除
    } else {
      filterByHashtag(hashtag);
    }
  }, [currentFilter, clearFilter, filterByHashtag]);

  // 人気ハッシュタグの計算（メモ化）
  const popularHashtags = useMemo(() => {
    return getPopularHashtags(allPosts, 5);
  }, [allPosts]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">投稿一覧</h2>
        <div className="flex flex-col items-center justify-center py-12 min-h-[400px]">
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
    <div className="space-y-6">
      {/* フィルター状態表示 */}
      <FilterStatus
        currentFilter={currentFilter}
        onClearFilter={clearFilter}
        filteredCount={posts.length}
        totalCount={allPosts.length}
      />

      {/* ハッシュタグ検索 */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-3 text-gray-800">ハッシュタグ検索</h3>
        <HashtagSearch
          posts={allPosts}
          onHashtagSelect={handleHashtagClick}
          currentFilter={currentFilter}
        />
      </div>

      {/* 人気ハッシュタグ表示 */}
      {!currentFilter && popularHashtags.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-3 text-gray-800">人気のハッシュタグ</h3>
          <div className="flex flex-wrap gap-2">
            {popularHashtags.map(({ hashtag, count }) => (
              <button
                key={hashtag}
                onClick={() => handleHashtagClick(hashtag)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                #{hashtag}
                <span className="ml-1 text-xs bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">投稿一覧</h2>
          <div className="text-sm text-gray-500">
            {posts.length} / {allPosts.length} 件
          </div>
        </div>
      
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
          {/* 投稿をループで表示 */}
          {posts.map((post) => (
            <article key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <header className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-800">
                    {post.nickname}
                  </span>
                  {post.hashtags && post.hashtags.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {post.hashtags.length}個のタグ
                    </span>
                  )}
                </div>
                <time className="text-sm text-gray-500 flex-shrink-0" dateTime={post.createdAt?.toDate?.()?.toISOString()}>
                  {formatDate(post.createdAt)}
                </time>
              </header>
              
              {/* 投稿内容（ハッシュタグハイライト付き） */}
              <PostContent 
                text={post.text} 
                onHashtagClick={handleHashtagClick}
                className="mb-3"
              />
              
              {/* ハッシュタグバッジ */}
              {post.hashtags && post.hashtags.length > 0 && (
                <footer>
                  <HashtagBadges
                    hashtags={post.hashtags}
                    onHashtagClick={handleHashtagClick}
                    currentFilter={currentFilter}
                  />
                </footer>
              )}
            </article>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}