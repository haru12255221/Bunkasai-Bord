
import { useAuthContext } from '../hooks/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AuthTest() {
  const { user, loading, signInAnonymously, setNickname, error } = useAuthContext() 
;

  const handleSignIn = async () => {
    try {
      await signInAnonymously();
      console.log('匿名認証成功');
    } catch (err) {
      console.error('認証エラー:', err);
    }
  };

  const handleSetNickname = async () => {
    try {
      await setNickname('テストユーザー');
      console.log('ニックネーム設定成功');
    } catch (err) {
      console.error('ニックネーム設定エラー:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('サインアウト成功');
      // ページをリロードして完全にリセット
      window.location.reload();
    } catch (err) {
      console.error('サインアウトエラー:', err);
    }
  };

  if (loading) {
    return <div>認証状態を確認中...</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50 text-gray-900">
      <h3 className="text-lg font-bold mb-4">Firebase認証テスト</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          エラー: {error}
        </div>
      )}
      
      <div className="mb-4">
        <strong>認証状態:</strong> {user ? '認証済み' : '未認証'}
      </div>
      
      {user && (
        <div className="mb-4">
          <div><strong>UID:</strong> {user.uid}</div>
          <div><strong>ニックネーム:</strong> {user.nickname || '未設定'}</div>
        </div>
      )}
      
      <div className="space-x-2">
        {!user && (
          <button 
            onClick={handleSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            匿名認証
          </button>
        )}
        
        {user && !user.nickname && (
          <button 
            onClick={handleSetNickname}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            ニックネーム設定
          </button>
        )}
        
        {user && (
          <button 
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            セッションリセット
          </button>
        )}
      </div>
    </div>
  );
}