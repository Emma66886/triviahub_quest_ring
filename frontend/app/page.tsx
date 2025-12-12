'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useAuth } from './components/AuthContext';
import { useSound } from './components/SoundContext';
import WalletAuth from './components/WalletAuth';
import { Volume2, VolumeX } from 'lucide-react';

interface Quest {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  category: string;
  experienceReward: number;
  solReward: number;
  estimatedTime: number;
  isOfficial?: boolean;
  createdBy?: {
    walletAddress: string;
  };
  progress?: {
    status: string;
    attempts: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function Home() {
  const { connected } = useWallet();
  const { isAuthenticated, authToken } = useAuth();
  const { playHover, playClick, soundEnabled, toggleSound } = useSound();
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'official' | 'community'>('all');
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);

  // Fetch quests on mount and when filter changes
  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching quests from API...');
      
      const url = filter === 'all' ? `${API_URL}/quests` : `${API_URL}/quests?filter=${filter}`;
      const response = await fetch(url);
      console.log('Quest response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Quests received:', data.quests?.length);
        setQuests(data.quests || []);
      } else {
        const errorData = await response.text();
        console.error('Failed to fetch quests:', response.status, errorData);
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchCompletedQuestIds = useCallback(async () => {
    if (!isAuthenticated || !authToken) {
      setCompletedQuestIds([]);
      return;
    }

    try {
      const token = authToken || localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/profile/completed-quests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCompletedQuestIds(data.completedQuestIds || []);
        console.log('Completed quest IDs:', data.completedQuestIds);
      }
    } catch (error) {
      console.error('Failed to fetch completed quests:', error);
    }
  }, [isAuthenticated, authToken]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  useEffect(() => {
    fetchCompletedQuestIds();
  }, [fetchCompletedQuestIds]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'NOVICE': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'EXPLORER': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'BUILDER': return 'text-violet-400 border-violet-500/30 bg-violet-500/10';
      case 'MASTER': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'NOVICE': return '🌟';
      case 'EXPLORER': return '🧭';
      case 'BUILDER': return '🏗️';
      case 'MASTER': return '👑';
      default: return '📚';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Triviahub Quest Ring
              </h1>
              <p className="text-gray-400 text-sm mt-1">Master Solana Development Through Interactive Learning</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSound}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              {connected && (
                <button
                  onClick={() => {
                    playClick();
                    router.push('/create-quest');
                  }}
                  onMouseEnter={playHover}
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-bold hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  Create Quest
                </button>
              )}
              <WalletAuth />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!connected ? (
          <div className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                Learn Solana Development{' '}
                <span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  The Fun Way
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Interactive quests, real blockchain practice, and NFT achievements
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-linear-to-br from-emerald-500/10 to-emerald-600/5 p-8 rounded-2xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all hover:scale-105">
                  <div className="text-5xl mb-4">🌟</div>
                  <h3 className="font-bold text-emerald-400 mb-3 text-lg">Novice</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Start with visual guides and interactive tutorials</p>
                </div>
                <div className="bg-linear-to-br from-cyan-500/10 to-cyan-600/5 p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all hover:scale-105">
                  <div className="text-5xl mb-4">🧭</div>
                  <h3 className="font-bold text-cyan-400 mb-3 text-lg">Explorer</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Guided code exercises with helpful hints</p>
                </div>
                <div className="bg-linear-to-br from-violet-500/10 to-violet-600/5 p-8 rounded-2xl border border-violet-500/20 hover:border-violet-400/40 transition-all hover:scale-105">
                  <div className="text-5xl mb-4">🏗️</div>
                  <h3 className="font-bold text-violet-400 mb-3 text-lg">Builder</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Create programs from the ground up</p>
                </div>
                <div className="bg-linear-to-br from-amber-500/10 to-amber-600/5 p-8 rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all hover:scale-105">
                  <div className="text-5xl mb-4">👑</div>
                  <h3 className="font-bold text-amber-400 mb-3 text-lg">Master</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">Advanced DeFi and NFT systems</p>
                </div>
              </div>

              <div className="bg-linear-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-10">
                <h3 className="text-3xl font-bold mb-6">🎯 What You&apos;ll Master</h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start gap-4 bg-gray-800/50 p-4 rounded-xl">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <p className="font-semibold text-gray-200 mb-1">Blockchain Fundamentals</p>
                      <p className="text-sm text-gray-400">Accounts, transactions & signatures</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-gray-800/50 p-4 rounded-xl">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <p className="font-semibold text-gray-200 mb-1">Program Development</p>
                      <p className="text-sm text-gray-400">Build & deploy smart contracts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-gray-800/50 p-4 rounded-xl">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <p className="font-semibold text-gray-200 mb-1">Token Mechanics</p>
                      <p className="text-sm text-gray-400">SPL tokens & NFT creation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-gray-800/50 p-4 rounded-xl">
                    <span className="text-green-400 text-2xl">✓</span>
                    <div>
                      <p className="font-semibold text-gray-200 mb-1">DeFi Protocols</p>
                      <p className="text-sm text-gray-400">Staking, swaps & liquidity pools</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-10">
              <h2 className="text-4xl font-bold mb-3 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Your Learning Journey</h2>
              <p className="text-gray-400 text-lg">Complete challenges, earn rewards, and level up your skills</p>
            </div>

            {/* Filter Tabs - Always visible when connected */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 bg-gray-800/50 rounded-xl p-2 border border-gray-700">
                <button
                  onClick={() => {
                    playClick();
                    setFilter('all');
                  }}
                  onMouseEnter={playHover}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  All Quests
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setFilter('official');
                  }}
                  onMouseEnter={playHover}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    filter === 'official'
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  ⭐ Official
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setFilter('community');
                  }}
                  onMouseEnter={playHover}
                  className={`px-6 py-2 rounded-lg font-bold transition-all ${
                    filter === 'community'
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  👥 Community
                </button>
              </div>
              <p className="text-sm text-gray-400">
                📊 <span className="text-purple-400 font-bold">{quests.length}</span> quest{quests.length !== 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mb-4"></div>
                <p className="mt-4 text-gray-400 text-lg">Loading your quests...</p>
              </div>
            ) : quests.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {quests.map((quest) => {
                  const difficultyStyles = getDifficultyColor(quest.difficulty);
                  const difficultyIcon = getDifficultyIcon(quest.difficulty);
                  const isCompleted = completedQuestIds.includes(quest._id);
                  
                  return (
                    <div
                      key={quest._id}
                      onClick={() => {
                        playClick();
                        router.push(`/quest/${quest._id}`);
                      }}
                      onMouseEnter={playHover}
                      className="group game-border rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${difficultyStyles}`}>
                            {difficultyIcon} {getDifficultyLabel(quest.difficulty)}
                          </span>
                          {!quest.isOfficial && (
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
                              👥 Community
                            </span>
                          )}
                        </div>
                        {isCompleted && (
                          <span className="text-green-400 text-2xl">✓</span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">{quest.title}</h3>
                      <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-relaxed">{quest.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-700">
                        <span className="flex items-center gap-1">
                          <span className="text-lg">⏱️</span>
                          {quest.estimatedTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-lg">⭐</span>
                          {quest.experienceReward} XP
                        </span>
                        {quest.solReward > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="text-lg">💰</span>
                            {quest.solReward} SOL
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gray-700/50 px-3 py-1.5 rounded-full text-gray-300 font-medium">
                          {quest.category}
                        </span>
                        {isCompleted ? (
                          <span className="text-green-400 text-sm font-bold">Completed ✓</span>
                        ) : (
                          <button className="text-purple-400 hover:text-purple-300 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Start <span>→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-300 text-lg mb-3">No quests available yet</p>
                <p className="text-sm text-gray-500">Check back soon for new challenges!</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/50 border-t border-gray-700/50 mt-24 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🎮</span>
              <p className="text-xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Quest Ring
              </p>
            </div>
            <p className="text-gray-400 mb-2">Master Solana Development Through Interactive Learning</p>
            <p className="text-sm text-gray-500">Built on Solana Devnet • Free to Learn • Earn NFT Badges</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
