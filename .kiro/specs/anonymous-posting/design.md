# Design Document

## Overview

文化祭掲示板アプリのMVP版における匿名投稿機能の設計文書です。Firebase Authentication（匿名認証）とFirestore Database を使用して、リアルタイムな投稿・表示システムを構築します。

## Architecture

### システム構成
- **フロントエンド**: Next.js (React) + Tailwind CSS
- **認証**: Firebase Authentication (匿名認証)
- **データベース**: Firestore Database
- **ホスティング**: Cloudflare Pages (Next.js on Pages)

### データフロー
1. ユーザーがアプリにアクセス
2. Firebase匿名認証でユーザーセッション作成
3. ニックネーム登録（初回のみ）
4. 投稿作成・送信
5. Firestoreにデータ保存
6. リアルタイムリスナーで全ユーザーに更新通知

## Components and Interfaces

### Firebase Configuration
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // 設定値は環境変数から取得
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Authentication Hook
```typescript
// hooks/AuthContextContextContext
Context
.ts
export interface User {
  uid: string;
  nickname: string | null;
  isAuthenticated: boolean;
}

export function AuthContextContextContextContextContextContextContextContextContextContext() 
: {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  setNickname: (nickname: string) => Promise<void>;
}
```

### Post Interface
```typescript
export interface Post {
  id: string;
  text: string;
  nickname: string;
  categoryId: string;
  createdAt: Timestamp;
  userId: string;
}
```

### User Interface
```typescript
export interface UserProfile {
  nickname: string;
  createdAt: Timestamp;
}
```

## Data Models

### Firestore Collections

#### users コレクション
- **ドキュメントID**: Firebase Auth UID
- **フィールド**:
  - `nickname: string` - ユーザーのニックネーム
  - `createdAt: Timestamp` - アカウント作成日時

#### posts コレクション
- **ドキュメントID**: 自動生成
- **フィールド**:
  - `text: string` - 投稿内容
  - `nickname: string` - 投稿者のニックネーム（非正規化）
  - `categoryId: string` - カテゴリID
  - `createdAt: Timestamp` - 投稿日時
  - `userId: string` - 投稿者のUID

### インデックス設計
- `posts` コレクション: `createdAt` フィールドで降順インデックス
- `posts` コレクション: `categoryId` + `createdAt` 複合インデックス

## Error Handling

### 認証エラー
- 匿名認証失敗時の再試行ロジック
- ネットワークエラー時のフォールバック

### データベースエラー
- 投稿作成失敗時のユーザーフィードバック
- リアルタイムリスナーの接続エラー処理

### バリデーションエラー
- クライアントサイドでの入力検証
- Firestore Security Rulesでのサーバーサイド検証

## Testing Strategy

### Unit Tests
- Firebase設定の初期化テスト
- 認証フックのテスト
- 投稿作成ロジックのテスト

### Integration Tests
- 匿名認証フローのテスト
- 投稿作成から表示までのエンドツーエンドテスト

### Security Rules Testing
- Firestore Security Rulesの単体テスト
- 不正アクセスの防止テスト

## Security Considerations

### Firebase Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // posts collection rules
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && validatePostData(request.resource.data);
      allow update, delete: if false; // 編集・削除は管理者のみ
    }
    
    // users collection rules
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

### データ検証
- 投稿内容の文字数制限
- ニックネームの重複チェック
- 不適切コンテンツのフィルタリング

## Performance Considerations

### リアルタイム更新の最適化
- Firestore リアルタイムリスナーの効率的な使用
- 不要な再レンダリングの防止

### データ取得の最適化
- ページネーション実装（将来的な拡張）
- インデックスの適切な設計

## Deployment Configuration

### 環境変数
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Cloudflare Pages設定
- Node.js互換性フラグの設定
- Firebase SDKの適切なバンドリング