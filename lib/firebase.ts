// Firebase設定とSDKの初期化
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase設定オブジェクト（環境変数から取得）
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseアプリの初期化
export const app = initializeApp(firebaseConfig);

// Firebase Authentication の初期化
export const auth = getAuth(app);

// Firestore Database の初期化
export const db = getFirestore(app);

// 設定の検証（開発時のデバッグ用）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized with project:', firebaseConfig.projectId);
  console.log('Firebase config:', firebaseConfig);
}