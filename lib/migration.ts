/**
 * データ移行ユーティリティ
 * categoryId から hashtags への移行処理
 */

import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { normalizeHashtags } from './hashtagUtils';

export interface MigrationResult {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ id: string; error: string }>;
}

export interface MigrationProgress {
  current: number;
  total: number;
  percentage: number;
  currentDocId?: string;
}

/**
 * categoryId を hashtags に変換する
 * @param categoryId - 変換対象のカテゴリID
 * @returns 正規化されたハッシュタグ配列
 */
export function convertCategoryToHashtags(categoryId: string): string[] {
  if (!categoryId || typeof categoryId !== 'string') {
    return [];
  }

  // カテゴリIDをハッシュタグ配列に変換
  const hashtags = [categoryId.trim()];
  
  // 正規化を適用
  return normalizeHashtags(hashtags);
}

/**
 * 単一の投稿ドキュメントを移行する
 * @param postId - 投稿ID
 * @param categoryId - 既存のカテゴリID
 * @returns 移行結果
 */
export async function migratePost(postId: string, categoryId: string): Promise<void> {
  const hashtags = convertCategoryToHashtags(categoryId);
  
  if (hashtags.length === 0) {
    throw new Error(`Invalid categoryId: ${categoryId}`);
  }

  const postRef = doc(db, 'posts', postId);
  
  // hashtagsフィールドを追加（categoryIdは保持）
  await updateDoc(postRef, {
    hashtags: hashtags
  });
}

/**
 * categoryId を持つ投稿を検索する
 * @returns categoryId を持つ投稿の配列
 */
export async function findLegacyPosts(): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
  const postsRef = collection(db, 'posts');
  
  // categoryId フィールドが存在し、hashtags フィールドが存在しない投稿を検索
  const querySnapshot = await getDocs(postsRef);
  
  const legacyPosts: Array<{ id: string; data: Record<string, unknown> }> = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    
    // categoryId があり、hashtags がない投稿を対象とする
    if (data.categoryId && !data.hashtags) {
      legacyPosts.push({
        id: doc.id,
        data: data
      });
    }
  });
  
  return legacyPosts;
}

/**
 * 全ての既存投稿データを一括移行する
 * @param onProgress - 進捗コールバック関数
 * @returns 移行結果
 */
export async function migrateAllPosts(
  onProgress?: (progress: MigrationProgress) => void
): Promise<MigrationResult> {
  const result: MigrationResult = {
    totalProcessed: 0,
    successCount: 0,
    errorCount: 0,
    errors: []
  };

  try {
    // 移行対象の投稿を検索
    const legacyPosts = await findLegacyPosts();
    result.totalProcessed = legacyPosts.length;

    if (legacyPosts.length === 0) {
      console.log('移行対象の投稿が見つかりませんでした');
      return result;
    }

    console.log(`${legacyPosts.length}件の投稿を移行します`);

    // バッチ処理で効率的に更新
    const batchSize = 500; // Firestoreのバッチ制限
    const batches: Array<Array<{ id: string; data: Record<string, unknown> }>> = [];
    
    for (let i = 0; i < legacyPosts.length; i += batchSize) {
      batches.push(legacyPosts.slice(i, i + batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = writeBatch(db);
      const currentBatch = batches[batchIndex];

      for (const post of currentBatch) {
        try {
          const categoryId = post.data.categoryId;
          if (typeof categoryId === 'string') {
            const hashtags = convertCategoryToHashtags(categoryId);
            
            if (hashtags.length > 0) {
              const postRef = doc(db, 'posts', post.id);
              batch.update(postRef, { hashtags: hashtags });
            }
          }
        } catch (error) {
          result.errorCount++;
          result.errors.push({
            id: post.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // バッチを実行
      await batch.commit();
      
      // 成功カウントを更新
      const batchSuccessCount = currentBatch.length - result.errors.filter(e => 
        currentBatch.some(p => p.id === e.id)
      ).length;
      result.successCount += batchSuccessCount;

      // 進捗を報告
      if (onProgress) {
        const current = (batchIndex + 1) * batchSize;
        onProgress({
          current: Math.min(current, legacyPosts.length),
          total: legacyPosts.length,
          percentage: Math.round((current / legacyPosts.length) * 100),
          currentDocId: currentBatch[currentBatch.length - 1]?.id
        });
      }
    }

    console.log(`移行完了: ${result.successCount}件成功, ${result.errorCount}件エラー`);
    
  } catch (error) {
    console.error('移行処理中にエラーが発生しました:', error);
    throw error;
  }

  return result;
}

/**
 * 移行状況を確認する
 * @returns 移行状況の統計
 */
export async function getMigrationStatus(): Promise<{
  totalPosts: number;
  legacyPosts: number;
  migratedPosts: number;
  migrationComplete: boolean;
}> {
  const postsRef = collection(db, 'posts');
  const querySnapshot = await getDocs(postsRef);
  
  let totalPosts = 0;
  let legacyPosts = 0;
  let migratedPosts = 0;
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    totalPosts++;
    
    if (data.categoryId && !data.hashtags) {
      legacyPosts++;
    } else if (data.hashtags) {
      migratedPosts++;
    }
  });
  
  return {
    totalPosts,
    legacyPosts,
    migratedPosts,
    migrationComplete: legacyPosts === 0
  };
}

/**
 * 移行のドライラン（実際の更新は行わない）
 * @returns 移行予定の投稿情報
 */
export async function dryRunMigration(): Promise<Array<{
  id: string;
  categoryId: string;
  convertedHashtags: string[];
}>> {
  const legacyPosts = await findLegacyPosts();
  
  return legacyPosts
    .filter(post => typeof post.data.categoryId === 'string')
    .map(post => ({
      id: post.id,
      categoryId: post.data.categoryId as string,
      convertedHashtags: convertCategoryToHashtags(post.data.categoryId as string)
    }));
}