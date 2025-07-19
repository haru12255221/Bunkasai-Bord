"use client";

/**
 * 投稿読み込み中に表示するスケルトン画面
 * 実際の投稿と同じレイアウトで「枠だけ」を表示
 */
export default function PostSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      {/* 投稿者名とタグ数の枠 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          {/* 投稿者名の枠 */}
          <div className="h-4 bg-gray-300 rounded w-20"></div>
          {/* タグ数の枠 */}
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        {/* 日時の枠 */}
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
      
      {/* 投稿内容の枠 */}
      <div className="mb-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
      
      {/* ハッシュタグの枠 */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-blue-200 rounded-full w-16"></div>
        <div className="h-6 bg-blue-200 rounded-full w-20"></div>
        <div className="h-6 bg-blue-200 rounded-full w-12"></div>
      </div>
    </div>
  );
}

/**
 * 複数のスケルトンを表示するコンポーネント
 */
export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}