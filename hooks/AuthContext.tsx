// AuthContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "./useAuth";
import type { UseAuthReturn } from "./useAuth";

const AuthContext = createContext<UseAuthReturn | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
    return ctx;
};

export { AuthContext };