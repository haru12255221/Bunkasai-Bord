# ハッシュタグ機能設計書

## 概要

既存の匿名投稿システムにハッシュタグ機能を統合し、従来のカテゴリー機能をハッシュタグベースの分類システムに置き換えます。これにより、より柔軟で直感的な投稿分類・検索・フィルタリング機能を提供します。既存のカテゴリー（感想、質問、応援、お知らせ）はデフォルトハッシュタグとして移行されます。

## アーキテクチャ

### データフロー
```
投稿作成 → ハッシュタグ抽出 → Firestore保存 → リアルタイム更新 → UI表示
検索/フィルター → クエリ実行 → 結果表示
```

### 主要コンポーネント
- **HashtagExtractor**: テキストからハッシュタグを抽出
- **HashtagRenderer**: 投稿内のハッシュタグを視覚的に表示
- **PopularHashtags**: 人気ハッシュタグの表示
- **HashtagSearch**: ハッシュタグ検索機能
- **拡張されたusePosts**: ハッシュタグフィルタリング機能

## コンポーネントとインターフェース

### 1. データモデル拡張

#### Post インターフェース拡張
```typescript
interface Post {
  id: string;
  text: string;
  nickname: string;
  createdAt: Timestamp;
  userId: string;
  hashtags: string[]; // カテゴリーを含むハッシュタグ配列
}
```

#### Firestore ドキュメント構造
```typescript
// posts コレクション
{
  text: string;
  nickname: string;
  createdAt: Timestamp;
  userId: string;
  hashtags: string[]; // ["感想", "楽しい", "文化祭"] など
}
```

#### カテゴリーからハッシュタグへの移行
- 既存カテゴリー「感想」→ ハッシュタグ「#感想」
- 既存カテゴリー「質問」→ ハッシュタグ「#質問」  
- 既存カテゴリー「応援」→ ハッシュタグ「#応援」
- 既存カテゴリー「お知らせ」→ ハッシュタグ「#お知らせ」

### 2. ユーティリティ関数

#### HashtagUtils
```typescript
interface HashtagUtils {
  extractHashtags(text: string): string[];
  normalizeHashtag(hashtag: string): string;
  renderHashtagsInText(text: string, onHashtagClick: (hashtag: string) => void): JSX.Element;
  validateHashtags(hashtags: string[]): boolean;
}
```

### 3. カスタムフック拡張

#### usePosts 拡張
```typescript
interface UsePostsReturn {
  posts: Post[];
  filteredPosts: Post[];
  createPost: (postData: NewPost) => Promise<void>;
  filterByHashtag: (hashtag: string | null) => void;
  currentFilter: string | null;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
}
```

#### useHashtags (新規)
```typescript
interface UseHashtagsReturn {
  popularHashtags: { hashtag: string; count: number }[];
  searchHashtags: (query: string) => string[];
  isLoading: boolean;
}
```

### 4. UIコンポーネント

#### HashtagRenderer
- 投稿テキスト内のハッシュタグをクリック可能なリンクとして表示
- ハッシュタグクリック時のフィルタリング機能

#### PopularHashtags
- 使用頻度の高いハッシュタグを表示
- クリックでフィルタリング機能
- リアルタイム更新

#### HashtagSearch
- ハッシュタグ検索入力フィールド
- オートコンプリート機能
- 検索結果のフィルタリング

#### HashtagInput (PostForm内)
- 投稿入力時のハッシュタグハイライト
- リアルタイムプレビュー

## データモデル

### Firestore コレクション構造

#### posts コレクション
```
posts/
├── {postId}/
│   ├── text: string
│   ├── nickname: string
│   ├── createdAt: Timestamp
│   ├── userId: string
│   └── hashtags: string[] // ["感想", "文化祭", "楽しい"]
```

#### データ移行戦略
既存の投稿データの`categoryId`フィールドを`hashtags`配列に変換：
- `categoryId: "感想"` → `hashtags: ["感想"]`
- 新しい投稿では`categoryId`フィールドは使用しない

### ハッシュタグ正規化ルール
1. 先頭の「#」を除去
2. 小文字に変換（日本語は除く）
3. 前後の空白を除去
4. 重複を除去
5. 最大長50文字、最大10個まで

### インデックス設計
```
// Firestore複合インデックス
posts:
- createdAt (desc)
- hashtags (array), createdAt (desc) // ハッシュタグフィルタリング用
```

## エラーハンドリング

### ハッシュタグ関連エラー
1. **ハッシュタグ抽出エラー**: 正規表現エラー時のフォールバック
2. **バリデーションエラー**: 長さ・数量制限違反時の警告
3. **検索エラー**: 検索クエリ実行失敗時の処理
4. **フィルタリングエラー**: データ取得失敗時の処理

### エラー表示戦略
- 非破壊的エラー: 警告メッセージ表示、機能継続
- 破壊的エラー: エラー状態表示、再試行オプション提供

## テスト戦略

### 単体テスト
1. **HashtagUtils**: ハッシュタグ抽出・正規化ロジック
2. **useHashtags**: フック機能のテスト
3. **コンポーネント**: レンダリングとイベントハンドリング

### 統合テスト
1. **投稿作成フロー**: ハッシュタグ付き投稿の作成から表示まで
2. **フィルタリング機能**: ハッシュタグによる投稿フィルタリング
3. **検索機能**: ハッシュタグ検索の動作確認

### E2Eテスト
1. **ユーザージャーニー**: 投稿作成→ハッシュタグクリック→フィルタリング
2. **リアルタイム更新**: 複数ユーザーでのハッシュタグ機能動作確認

## パフォーマンス考慮事項

### 最適化戦略
1. **ハッシュタグ抽出**: メモ化による重複計算回避
2. **人気ハッシュタグ**: クライアントサイドキャッシュ
3. **検索機能**: デバウンス処理による過度なクエリ防止
4. **フィルタリング**: クライアントサイドフィルタリングとサーバーサイドクエリの使い分け

### メモリ管理
- 大量の投稿データに対する効率的なフィルタリング
- 不要なリスナーの適切なクリーンアップ

## セキュリティ考慮事項

### Firestore Security Rules拡張
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && validatePost(request.resource.data);
      allow update, delete: if false; // 投稿の編集・削除は禁止
    }
  }
  
  function validatePost(data) {
    return data.keys().hasAll(['text', 'nickname', 'createdAt', 'userId', 'hashtags'])
      && data.text is string
      && data.text.size() <= 500
      && data.hashtags is list
      && data.hashtags.size() <= 10
      && validateHashtags(data.hashtags);
  }
  
  function validateHashtags(hashtags) {
    return hashtags.hasOnly([string])
      && hashtags.size() <= 10;
  }
}
```

### 入力サニタイゼーション
1. ハッシュタグ内の特殊文字制限
2. XSS攻撃防止のためのエスケープ処理
3. 不適切なハッシュタグのフィルタリング

## 実装フェーズ

### フェーズ1: データ移行と基盤機能
- 既存投稿データの`categoryId`から`hashtags`への移行
- ハッシュタグ抽出・正規化ユーティリティ
- PostFormのカテゴリー選択からハッシュタグ入力への変更

### フェーズ2: 表示とフィルタリング
- PostListでのハッシュタグ表示（カテゴリーバッジ置き換え）
- ハッシュタグクリックによるフィルタリング機能
- 人気ハッシュタグ表示

### フェーズ3: 検索とUX向上
- ハッシュタグ検索機能
- リアルタイムハイライト
- オートコンプリート機能

## 既存システムとの統合

### 影響を受けるコンポーネント
1. **PostForm**: カテゴリー選択をハッシュタグ入力に置き換え
2. **PostList**: カテゴリー表示をハッシュタグ表示に置き換え、フィルタリング機能追加
3. **usePosts**: データ構造変更とフィルタリング機能拡張

### データ移行と後方互換性
- 既存投稿の`categoryId`を`hashtags`配列に変換するマイグレーション
- 移行期間中は両フィールドをサポート
- 段階的な機能展開により既存機能への影響を最小化

### UI/UX変更点
- カテゴリー選択ドロップダウン → ハッシュタグ入力フィールド（デフォルト候補付き）
- カテゴリーバッジ → クリック可能なハッシュタグリンク
- より柔軟な投稿分類が可能