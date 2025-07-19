"use client";

import { useState, useEffect } from 'react';
import { 
  migrateAllPosts, 
  getMigrationStatus, 
  dryRunMigration,
  MigrationResult,
  MigrationProgress
} from '../lib/migration';

interface MigrationStatus {
  totalPosts: number;
  legacyPosts: number;
  migratedPosts: number;
  migrationComplete: boolean;
}

export default function MigrationPanel() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dryRunResults, setDryRunResults] = useState<Array<{
    id: string;
    categoryId: string;
    convertedHashtags: string[];
  }> | null>(null);

  // 移行状況を取得
  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const migrationStatus = await getMigrationStatus();
      setStatus(migrationStatus);
    } catch (err) {
      console.error('移行状況の取得に失敗:', err);
      setError('移行状況の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // ドライランを実行
  const runDryRun = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const results = await dryRunMigration();
      setDryRunResults(results);
    } catch (err) {
      console.error('ドライランに失敗:', err);
      setError('ドライランに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 移行を実行
  const runMigration = async () => {
    if (!window.confirm('データ移行を実行しますか？この操作は元に戻せません。')) {
      return;
    }

    try {
      setIsMigrating(true);
      setError(null);
      setProgress(null);
      setMigrationResult(null);

      const result = await migrateAllPosts((progressData) => {
        setProgress(progressData);
      });

      setMigrationResult(result);
      
      // 移行完了後、状況を再取得
      await fetchStatus();
    } catch (err) {
      console.error('移行に失敗:', err);
      setError('移行に失敗しました: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsMigrating(false);
      setProgress(null);
    }
  };

  // 初期状況取得
  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">データ移行パネル</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 移行状況表示 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">移行状況</h3>
        {isLoading && !isMigrating ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
            <span className="text-gray-600">状況を確認中...</span>
          </div>
        ) : status ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-600">総投稿数</div>
              <div className="text-xl font-semibold">{status.totalPosts}</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <div className="text-sm text-gray-600">移行待ち</div>
              <div className="text-xl font-semibold text-yellow-600">{status.legacyPosts}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm text-gray-600">移行済み</div>
              <div className="text-xl font-semibold text-green-600">{status.migratedPosts}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-gray-600">完了状況</div>
              <div className="text-xl font-semibold text-blue-600">
                {status.migrationComplete ? '完了' : '未完了'}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 進捗表示 */}
      {progress && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">移行進捗</h3>
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{progress.current} / {progress.total}</span>
            <span>{progress.percentage}%</span>
          </div>
          {progress.currentDocId && (
            <div className="text-xs text-gray-500 mt-1">
              処理中: {progress.currentDocId}
            </div>
          )}
        </div>
      )}

      {/* 移行結果表示 */}
      {migrationResult && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">移行結果</h3>
          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">処理済み</div>
                <div className="text-lg font-semibold">{migrationResult.totalProcessed}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">成功</div>
                <div className="text-lg font-semibold text-green-600">{migrationResult.successCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">エラー</div>
                <div className="text-lg font-semibold text-red-600">{migrationResult.errorCount}</div>
              </div>
            </div>
            
            {migrationResult.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-600 mb-2">エラー詳細:</h4>
                <div className="max-h-32 overflow-y-auto">
                  {migrationResult.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 mb-1">
                      ID: {error.id} - {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ドライラン結果表示 */}
      {dryRunResults && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">ドライラン結果</h3>
          <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
            {dryRunResults.length === 0 ? (
              <p className="text-gray-600">移行対象の投稿が見つかりませんでした</p>
            ) : (
              <div className="space-y-2">
                {dryRunResults.slice(0, 10).map((result, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-mono text-gray-500">{result.id}</span>
                    <span className="mx-2">:</span>
                    <span className="text-blue-600">&quot;{result.categoryId}&quot;</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600">[{result.convertedHashtags.join(', ')}]</span>
                  </div>
                ))}
                {dryRunResults.length > 10 && (
                  <div className="text-sm text-gray-500">
                    ...他 {dryRunResults.length - 10} 件
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={fetchStatus}
          disabled={isLoading || isMigrating}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          状況更新
        </button>
        
        <button
          onClick={runDryRun}
          disabled={isLoading || isMigrating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ドライラン
        </button>
        
        {status && status.legacyPosts > 0 && (
          <button
            onClick={runMigration}
            disabled={isLoading || isMigrating}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMigrating ? '移行中...' : '移行実行'}
          </button>
        )}
      </div>

      {status?.migrationComplete && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          ✅ 全ての投稿の移行が完了しています
        </div>
      )}
    </div>
  );
}