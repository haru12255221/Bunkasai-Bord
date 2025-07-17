import { useState, useEffect } from 'react';
import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// ユーザー情報の型定義
export interface User {
  uid: string;
  nickname: string | null;
  isAuthenticated: boolean;
}

// AuthContextフックの戻り値の型定義
export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  setNickname: (nickname: string) => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [duplicateCandidate, setDuplicateCandidate] = useState<string | null>(null);

  // Firebase認証状態の監視と自動匿名認証
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // 認証済みユーザーの場合、Firestoreからニックネームを取得
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          setUser({
            uid: firebaseUser.uid,
            nickname: userData?.nickname || null,
            isAuthenticated: true,
          });
        } catch (err) {
          console.error('ユーザーデータの取得に失敗しました:', err);
          setError(`ユーザーデータの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } else {
        // 未認証の場合、自動的に匿名認証を実行
        try {
          await signInAnonymously(auth);
        } catch (err: any) {
          console.error('自動匿名認証に失敗しました:', err);
          if (err.code === 'auth/admin-restricted-operation') {
            setError('匿名認証が有効になっていません。Firebase Consoleで匿名認証を有効にしてください。');
          } else {
            setError(`認証に失敗しました: ${err.message || 'もう一度お試しください。'}`);
          }
          setUser(null);
        }
      }
      setLoading(false);
    });

    // クリーンアップ関数
    return () => unsubscribe();
  }, []);

  // 匿名認証を実行する関数
  const handleSignInAnonymously = async (): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await signInAnonymously(auth);
      // onAuthStateChangedで自動的にユーザー状態が更新される
    } catch (err: any) {
      console.error('匿名認証に失敗しました:', err);
      if (err.code === 'auth/admin-restricted-operation') {
        setError('匿名認証が有効になっていません。Firebase Consoleで匿名認証を有効にしてください。');
      } else {
        setError(`認証に失敗しました: ${err.message || 'もう一度お試しください。'}`);
      }
      setLoading(false);
    }
  };

  // ニックネーム重複チェック関数
  const checkNicknameAvailability = async (nickname: string): Promise<string> => {
    try {
      console.log('Firestore クエリ実行:', nickname);
      const q = query(collection(db, 'users'), where('nickname', '==', nickname));
      const querySnapshot = await getDocs(q);
      console.log('クエリ結果:', { empty: querySnapshot.empty, size: querySnapshot.size });
      
      if (querySnapshot.empty) {
        return nickname; // 重複なし
      }
      
      // 重複がある場合、数字を付加して調整
      let counter = 2;
      let adjustedNickname = `${nickname}${counter}`;
      
      while (true) {
        console.log('調整されたニックネームをチェック:', adjustedNickname);
        const adjustedQuery = query(collection(db, 'users'), where('nickname', '==', adjustedNickname));
        const adjustedSnapshot = await getDocs(adjustedQuery);
        
        if (adjustedSnapshot.empty) {
          return adjustedNickname; // 利用可能なニックネーム
        }
        
        counter++;
        adjustedNickname = `${nickname}${counter}`;
        
        // 無限ループ防止（最大100回まで）
        if (counter > 100) {
          throw new Error('ニックネームの調整に失敗しました');
        }
      }
    } catch (err) {
      console.error('重複チェック中にエラー:', err);
      throw err;
    }
  };

  // ニックネームを設定する関数
  const handleSetNickname = async (nickname: string): Promise<void> => {
    console.log('ニックネーム設定開始:', { nickname, user: user?.uid });
    
    if (!user?.uid) {
      console.error('ユーザーが認証されていません:', user);
      throw new Error('ユーザーが認証されていません');
    }

    try {
      setError(null);
      console.log('重複チェック開始...');
      
      // ニックネーム重複チェックと自動調整
      const finalNickname = await checkNicknameAvailability(nickname);
      console.log('重複チェック完了:', { original: nickname, final: finalNickname });
      
      // Firestoreのusersコレクションにニックネームを保存
      console.log('Firestore書き込み開始...');
      await setDoc(doc(db, 'users', user.uid), {
        nickname: finalNickname,
        createdAt: serverTimestamp(),
      });
      console.log('Firestore書き込み完了');

      // ローカル状態を即座に更新
      const updatedUser = { ...user, nickname: finalNickname };
      setUser(updatedUser);
      console.log('ローカル状態更新完了:', updatedUser);
      
      // 状態更新を確実にするため、少し待ってから再度確認
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 強制的に状態を再設定して確実に更新
      setUser({ ...updatedUser });
      console.log('最終的なユーザー状態:', updatedUser);
      
      // 調整されたニックネームの場合は通知
      if (finalNickname !== nickname) {
        console.log(`ニックネームが調整されました: ${nickname} → ${finalNickname}`);
      }
    } catch (err) {
      console.error('ニックネームの設定に失敗しました:', err);
      setError(`ニックネームの設定に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  return {
    user,
    loading,
    signInAnonymously: handleSignInAnonymously,
    setNickname: handleSetNickname,
    error,
  };
}