import { NextResponse } from 'next/server';

export const runtime = 'edge';

// このAPIエンドポイントは非推奨です。
// 代わりにFirebase Firestoreを直接使用してください。

export async function GET() {
  return NextResponse.json(
    { 
      error: 'このAPIエンドポイントは非推奨です。Firebase Firestoreを使用してください。',
      message: '既存のD1/SQLiteベースのAPIからFirebaseへの移行が完了しました。'
    }, 
    { status: 410 } // Gone
  );
}

export async function POST() {
  return NextResponse.json(
    { 
      error: 'このAPIエンドポイントは非推奨です。Firebase Firestoreを使用してください。',
      message: '既存のD1/SQLiteベースのAPIからFirebaseへの移行が完了しました。'
    }, 
    { status: 410 } // Gone
  );
}