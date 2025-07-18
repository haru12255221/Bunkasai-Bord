"use client";

import React, { createContext, useContext } from 'react';
import { useAuth, User } from './useAuth';

// AuthContextの型定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  setNickname: (nickname: string) => Promise<void>;
  setNicknameDirectly: (nickname: string) => Promise<void>;
  error: string | null;
}

// AuthContextを作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProviderコンポーネント
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuthContextフック
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}