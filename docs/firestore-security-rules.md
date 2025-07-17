# Firestore Security Rules 解説

このドキュメントでは、文化祭掲示板アプリのFirestore Security Rulesについて解説します。

## 基本概念

Firestore Security Rulesは、データベースへのアクセスを制御するためのルールセットです。
これにより、クライアントサイドからのデータアクセスを安全に行うことができます。

## 共通の検証関数

### `isAuthenticated()`

```javascript
function isAuthenticated() {
  return request.auth != null;
}
```

- **目的**: ユーザーが認証済みかどうかを確認します
- **戻り値**: ユーザーが認証されている場合は`true`、そうでない場合は`false`
- **使用例**: 認証済みユーザーのみがデータにアクセスできるようにする

### `isOwner(userId)`

```javascript
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}
```

- **目的**: リクエストを行ったユーザーが、指定されたユーザーIDの所有者かどうかを確認します
- **引数**: `userId` - 所有者を確認するユーザーID
- **戻り値**: ユーザーが所有者である場合は`true`、そうでない場合は`false`
- **使用例**: ユーザーが自分のデータのみにアクセスできるようにする

## 投稿データの検証

### `validatePostData(data)`

```javascript
function validatePostData(data) {
  return data.size() == 5 &&
         'text' in data && data.text is string && data.text.size() > 0 && data.text.size() <= 500 &&
         'nickname' in data && data.nickname is string && data.nickname.size() > 0 &&
         'categoryId' in data && data.categoryId is string &&
         'createdAt' in data && data.createdAt is timestamp &&
         'userId' in data && data.userId is string;
}
```

- **目的**: 投稿データが正しい形式であることを検証します
- **引数**: `data` - 検証する投稿データ
- **検証内容**:
  - データは5つのフィールドを持つこと
  - `text`: 文字列で、1〜500文字であること
  - `nickname`: 文字列で、空でないこと
  - `categoryId`: 文字列であること
  - `createdAt`: タイムスタンプであること
  - `userId`: 文字列であること
- **戻り値**: データが有効な場合は`true`、そうでない場合は`false`
- **使用例**: 投稿作成時にデータの形式を検証する

## コレクション別ルール

### posts コレクション

```javascript
match /posts/{postId} {
  // 認証済みユーザーのみ読み取り可能
  allow read: if isAuthenticated();
  
  // 認証済みユーザーのみ作成可能、かつデータ検証を通過すること
  allow create: if isAuthenticated() && validatePostData(request.resource.data);
  
  // 編集・削除は禁止（管理者のみが可能）
  allow update, delete: if false;
}
```

- **読み取り権限**: 認証済みユーザーのみ
- **作成権限**: 認証済みユーザーのみ、かつデータが検証を通過すること
- **編集・削除権限**: なし（管理者のみが可能）

### users コレクション

```javascript
match /users/{userId} {
  // 自分のデータのみ読み書き可能
  allow read, write: if isOwner(userId);
}
```

- **読み取り権限**: 自分のデータのみ
- **書き込み権限**: 自分のデータのみ

## セキュリティ上の考慮事項

1. **最小権限の原則**: ユーザーには必要最小限の権限のみを付与しています
2. **データ検証**: クライアントからの入力は常に検証されます
3. **認証の強制**: 認証されていないユーザーはデータにアクセスできません
4. **所有権の確認**: ユーザーは自分のデータのみにアクセスできます

## 管理者アクセス

現在のルールでは、管理者アクセスは実装されていません。管理者機能が必要な場合は、以下のような方法で実装できます：

1. Firestoreに`admins`コレクションを作成し、管理者のUIDを保存する
2. 管理者かどうかを確認する関数を追加する:

```javascript
function isAdmin() {
  return isAuthenticated() && 
         exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

3. 管理者に特別な権限を付与する:

```javascript
// 例: 管理者は投稿の編集・削除が可能
allow update, delete: if isAdmin();
```

## デプロイ方法

Firebase CLIを使用してルールをデプロイします：

```bash
firebase deploy --only firestore:rules
```

## 参考リンク

- [Firestore Security Rules リファレンス](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Firestore Security Rules の書き方](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Firestore Security Rules のテスト](https://firebase.google.com/docs/firestore/security/test-rules)