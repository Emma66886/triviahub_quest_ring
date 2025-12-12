'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSound } from './SoundContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface User {
  id: string;
  walletAddress: string;
  username?: string;
  currentLevel: string;
  experience: number;
  playSolBalance: number;
  totalScore: number;
  streak: number;
}

export default function WalletAuth() {
  const { publicKey, connected } = useWallet();
  const { isAuthenticated, login, logout } = useAuth();
  const { playHover, playClick, playSuccess, playError } = useSound();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }, []);

  const authenticateWallet = useCallback(async () => {
    if (!publicKey) return;

    try {
      setLoading(true);
      setError('');

      const success = await login();
      
      if (success) {
        playSuccess();
        await fetchUserProfile();
        // Trigger event for other components to refetch data
        window.dispatchEvent(new Event('authComplete'));
        console.log('Authentication successful');
      } else {
        playError();
        throw new Error('Authentication failed');
      }
    } catch (err) {
      playError();
      console.error('Authentication error:', err);
      setError('Failed to authenticate wallet');
    } finally {
      setLoading(false);
    }
  }, [publicKey, login, fetchUserProfile, playSuccess, playError]);

  useEffect(() => {
    if (connected && publicKey && !isAuthenticated) {
      authenticateWallet();
    } else if (!connected) {
      setUser(null);
      logout();
    } else if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [connected, publicKey, isAuthenticated, authenticateWallet, logout, fetchUserProfile]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <WalletMultiButton />
      
      {loading && (
        <div className="text-blue-500">Authenticating...</div>
      )}
      
      {error && (
        <div className="text-red-500">{error}</div>
      )}
      
      {user && (
        <div className="game-border rounded-2xl p-6 mt-4 w-full max-w-md">
          <h3 className="text-2xl font-bold mb-5 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome, Developer! 👋
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-purple-500/30 transition-colors">
              <span className="text-gray-400 text-sm">Level:</span>
              <span className="font-bold text-purple-300">{user.currentLevel}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-cyan-500/30 transition-colors">
              <span className="text-gray-400 text-sm">Experience:</span>
              <span className="font-bold text-cyan-300">{user.experience} XP</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-emerald-500/30 transition-colors">
              <span className="text-gray-400 text-sm">Play SOL:</span>
              <span className="font-bold text-emerald-300">{user.playSolBalance}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-amber-500/30 transition-colors">
              <span className="text-gray-400 text-sm">Score:</span>
              <span className="font-bold text-amber-300">{user.totalScore}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-orange-500/30 transition-colors">
              <span className="text-gray-400 text-sm">Streak:</span>
              <span className="font-bold text-orange-300">{user.streak} days 🔥</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
