'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null;
  login: () => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { publicKey, signMessage, connected } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const walletAddress = localStorage.getItem('walletAddress');
    
    if (token && walletAddress && publicKey?.toBase58() === walletAddress) {
      setAuthToken(token);
      setIsAuthenticated(true);
    } else if (token && publicKey?.toBase58() !== walletAddress) {
      // Wallet changed, clear old auth
      logout();
    }
  }, [publicKey]);

  // Auto logout when wallet disconnects
  useEffect(() => {
    if (!connected) {
      logout();
    }
  }, [connected]);

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const walletAddress = localStorage.getItem('walletAddress');
    return !!(token && walletAddress && publicKey?.toBase58() === walletAddress);
  };

  const login = async (): Promise<boolean> => {
    if (!publicKey || !signMessage) {
      console.error('Wallet not connected');
      return false;
    }

    // Check if already authenticated for this wallet
    const existingToken = localStorage.getItem('authToken');
    const existingWallet = localStorage.getItem('walletAddress');
    
    if (existingToken && existingWallet === publicKey.toBase58()) {
      setAuthToken(existingToken);
      setIsAuthenticated(true);
      return true;
    }

    try {
      // Request authentication message from backend
      const nonceResponse = await fetch(`${API_URL}/auth/nonce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: publicKey.toBase58() }),
      });

      if (!nonceResponse.ok) {
        throw new Error('Failed to get nonce');
      }

      const { nonce } = await nonceResponse.json();
      const message = `Sign this message to authenticate with Quest Ring.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      // Verify signature and get JWT token
      const authResponse = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          signature: bs58.encode(signature),
          message,
        }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const { token } = await authResponse.json();
      
      // Store token and wallet address
      localStorage.setItem('authToken', token);
      localStorage.setItem('walletAddress', publicKey.toBase58());
      
      setAuthToken(token);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('walletAddress');
    setAuthToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
