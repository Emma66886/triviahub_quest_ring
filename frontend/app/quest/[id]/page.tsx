'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import BlockEditor from '@/app/components/BlockEditor';
import { useAuth } from '@/app/components/AuthContext';
import { useSound } from '@/app/components/SoundContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Quest {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  estimatedTime: number;
  experienceReward: number;
  solReward: number;
  type: string;
  content: {
    instructions: string;
    starterCode?: string;
    hints: string[];
    concepts: string[];
    videoUrl?: string;
    blockData?: {
      availableBlocks: Array<{ id: string; text: string; icon: string; color: string }>;
      correctOrder: string[];
      explanation?: string;
    };
  };
  progress?: {
    status: string;
    attempts: number;
  };
}

export default function QuestDetail() {
  const params = useParams();
  const router = useRouter();
  const { connected } = useWallet();
  const { isAuthenticated, authToken, login } = useAuth();
  const { playHover, playClick, playSuccess, playError, playStart } = useSound();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rewards, setRewards] = useState<{ experience: number; sol: number; score: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (quest && timeLeft === null) {
      setTimeLeft(quest.estimatedTime * 60);
    }
  }, [quest, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Sample quest data for block editor
  const getBlockQuestData = () => {
    if (!quest) return null;

    // If quest has blockData, use it
    if (quest.content.blockData) {
      return {
        availableBlocks: quest.content.blockData.availableBlocks,
        slots: quest.content.blockData.availableBlocks.length,
        hint: quest.content.hints[0] || 'Think about the logical flow of operations',
        explanation: quest.content.blockData.explanation
      };
    }

    // Default quest structure for different quest types
    interface QuestTemplate {
      availableBlocks: Array<{ id: string; text: string; icon: string; color: string }>;
      correctOrder: string[];
      slots: number;
      hint: string;
      explanation: string;
    }

    const questTemplates: Record<string, QuestTemplate> = {
      'Welcome to Solana': {
        availableBlocks: [
          { id: 'connection', text: 'Connect to Devnet', icon: '🔌', color: 'bg-blue-500' },
          { id: 'keypair', text: 'Create Keypair', icon: '🔑', color: 'bg-purple-500' },
          { id: 'balance', text: 'Check Balance', icon: '💰', color: 'bg-green-500' },
          { id: 'log', text: 'Log Result', icon: '📋', color: 'bg-gray-500' },
        ],
        correctOrder: ['connection', 'keypair', 'balance', 'log'],
        slots: 4,
        hint: "Start by connecting to the network, then create an identity, check funds, and display results",
        explanation: "Perfect! You've created your first Solana interaction: (1) Connect to devnet, (2) Create a keypair, (3) Check balance, (4) Log the result!"
      },
      'Check Your Balance': {
        availableBlocks: [
          { id: 'pubkey', text: 'Get Public Key', icon: '📍', color: 'bg-blue-500' },
          { id: 'connection', text: 'Connect to Network', icon: '🔌', color: 'bg-purple-500' },
          { id: 'getbalance', text: 'Get Balance', icon: '💵', color: 'bg-green-500' },
          { id: 'display', text: 'Display in SOL', icon: '✨', color: 'bg-yellow-500' },
        ],
        correctOrder: ['connection', 'pubkey', 'getbalance', 'display'],
        slots: 4,
        hint: "Connect first, then specify whose balance, fetch it, and finally convert from lamports to SOL",
        explanation: "Excellent! Balance checking: (1) Connect to network, (2) Get the public key, (3) Fetch balance, (4) Convert and display!"
      },
      'Build a Token Transfer Program': {
        availableBlocks: [
          { id: 'sender', text: 'From: Alice', icon: '👤', color: 'bg-purple-500' },
          { id: 'recipient', text: 'To: Bob', icon: '👤', color: 'bg-blue-500' },
          { id: 'amount', text: 'Amount: 5 SOL', icon: '💰', color: 'bg-green-500' },
          { id: 'signature', text: 'Sign Transaction', icon: '🔑', color: 'bg-orange-500' },
        ],
        correctOrder: ['sender', 'recipient', 'amount', 'signature'],
        slots: 4,
        hint: "Think: WHO is sending → WHERE is it going → HOW MUCH → PROVE it's you",
        explanation: "Perfect! Transfers need: (1) Sender, (2) Recipient, (3) Amount, (4) Signature to authorize!"
      },
      'Create Your First NFT': {
        availableBlocks: [
          { id: 'metadata', text: 'Upload Metadata', icon: '📄', color: 'bg-purple-500' },
          { id: 'mint', text: 'Create Mint', icon: '🎨', color: 'bg-pink-500' },
          { id: 'token-account', text: 'Token Account', icon: '🏦', color: 'bg-blue-500' },
          { id: 'mint-to', text: 'Mint NFT', icon: '⚡', color: 'bg-yellow-500' },
          { id: 'freeze', text: 'Freeze Authority', icon: '❄️', color: 'bg-cyan-500' },
        ],
        correctOrder: ['metadata', 'mint', 'token-account', 'mint-to', 'freeze'],
        slots: 5,
        hint: "Prepare data → Create mint → Storage → Mint token → Lock it down",
        explanation: "Amazing! NFT minting: (1) Upload metadata, (2) Create mint, (3) Create token account, (4) Mint 1 token, (5) Freeze to make unique!"
      }
    };

    return questTemplates[quest.title] || {
      availableBlocks: [
        { id: 'step1', text: 'Step 1', icon: '1️⃣', color: 'bg-blue-500' },
        { id: 'step2', text: 'Step 2', icon: '2️⃣', color: 'bg-purple-500' },
        { id: 'step3', text: 'Step 3', icon: '3️⃣', color: 'bg-green-500' },
      ],
      correctOrder: ['step1', 'step2', 'step3'],
      slots: 3,
      hint: "Follow the logical order of operations",
      explanation: "Great job completing this quest!"
    };
  };

  const fetchQuest = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/quests/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setQuest(data.quest);
      } else {
        console.error('Failed to fetch quest');
      }
    } catch (error) {
      console.error('Error fetching quest:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchQuest();
  }, [fetchQuest]);

  // Fetch completion status
  useEffect(() => {
    const checkCompletion = async () => {
      if (!isAuthenticated || !authToken || !params.id) {
        setIsCompleted(false);
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
          setIsCompleted(data.completedQuestIds?.includes(params.id) || false);
        }
      } catch (error) {
        console.error('Failed to check completion status:', error);
      }
    };

    checkCompletion();
  }, [isAuthenticated, authToken, params.id]);

  const startQuest = async () => {
    if (!connected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (!isAuthenticated) {
      const success = await login();
      if (!success) {
        alert('Please authenticate your wallet first!');
        return;
      }
    }

    const token = authToken || localStorage.getItem('authToken');
    if (!token) {
      alert('Please authenticate your wallet first!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/quests/${params.id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchQuest();
      }
    } catch (error) {
      console.error('Error starting quest:', error);
    }
  };

  const submitCode = async (blockOrder: string[]) => {
    if (!connected) {
      throw new Error('Please connect your wallet first!');
    }

    if (!isAuthenticated) {
      const success = await login();
      if (!success) {
        throw new Error('Please authenticate your wallet first!');
      }
    }

    const token = authToken || localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Please authenticate your wallet first!');
    }

    try {
      const response = await fetch(`${API_URL}/quests/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockOrder }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success && data.isCorrect) {
          playSuccess();
          // Store rewards and show success modal
          setRewards(data.rewards);
          setShowSuccessModal(true);
          setIsCompleted(true);
          // Update quest data without full page refresh
          setQuest(prev => prev ? { ...prev, progress: { status: 'COMPLETED', attempts: data.progress.attempts } } : null);
        } else {
          playError();
        }
        return data;
      } else {
        playError();
        if (data.alreadyCompleted) {
          await fetchQuest();
          return {
            success: false,
            isCorrect: false,
            message: 'You have already completed this quest!'
          };
        }
        throw new Error(data.error || 'Failed to submit');
      }
    } catch (error) {
      playError();
      console.error('Error submitting quest:', error);
      throw error;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'NOVICE': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50';
      case 'EXPLORER': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/50';
      case 'BUILDER': return 'text-violet-400 bg-violet-500/20 border-violet-500/50';
      case 'MASTER': return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-2xl text-purple-400">Loading quest...</div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl text-gray-300 mb-4">Quest not found</div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Success Modal */}
      {showSuccessModal && rewards && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-green-500 shadow-2xl shadow-green-500/20 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">Quest Completed!</h2>
              <p className="text-gray-300 mb-6">Congratulations! You&apos;ve mastered this quest.</p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      Experience
                    </span>
                    <span className="text-2xl font-bold text-purple-400">+{rewards.experience} XP</span>
                  </div>
                </div>
                
                <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center gap-2">
                      <span className="text-2xl">💰</span>
                      Reward
                    </span>
                    <span className="text-2xl font-bold text-yellow-400">+{rewards.sol} SOL</span>
                  </div>
                </div>
                
                <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      Score
                    </span>
                    <span className="text-2xl font-bold text-blue-400">{rewards.score} pts</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    playClick();
                    setShowSuccessModal(false);
                    setRewards(null);
                  }}
                  onMouseEnter={playHover}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  View Quest
                </button>
                <button
                  onClick={() => {
                    playClick();
                    router.push('/');
                  }}
                  onMouseEnter={playHover}
                  className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Next Quest →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                playClick();
                router.push('/');
              }}
              onMouseEnter={playHover}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-2xl">←</span>
              <span className="font-bold">Back to Quests</span>
            </button>
            <div className="flex items-center gap-3">
              {isCompleted && (
                <span className="text-xs font-bold uppercase px-4 py-2 rounded-full border bg-green-600/20 text-green-400 border-green-500/50">
                  ✅ COMPLETED
                </span>
              )}
              <span className={`text-xs font-bold uppercase px-4 py-2 rounded-full border ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Quest Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {quest.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6">{quest.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                {quest.estimatedTime} minutes
              </span>
              <span className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                {quest.experienceReward} XP
              </span>
              {quest.solReward > 0 && (
                <span className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  {quest.solReward} SOL
                </span>
              )}
              <span className="px-3 py-1 bg-gray-800 rounded-full">
                {quest.category}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Instructions */}
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">📋 Instructions</h2>
                <p className="text-gray-300 leading-relaxed">{quest.content.instructions}</p>
              </div>

              {/* Concepts */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400">💡 Key Concepts</h2>
                <div className="flex flex-wrap gap-2">
                  {quest.content.concepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 text-sm"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hints */}
              {quest.content.hints.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4 text-yellow-400">💭 Hints</h2>
                  <ul className="space-y-2">
                    {quest.content.hints.map((hint, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Editor */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                {getBlockQuestData() && (
                  <BlockEditor 
                    questData={getBlockQuestData()!}
                    onSubmit={submitCode}
                    isCompleted={isCompleted}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isCompleted ? (
                  <button
                    onClick={() => {
                      playStart();
                      startQuest();
                    }}
                    onMouseEnter={playHover}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                  >
                    Start Quest 🚀
                  </button>
                ) : (
                  <div className="flex-1 bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-center shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                    ✅ Completed!
                  </div>
                )}
              </div>

              {!connected && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                  <p className="text-yellow-400 text-sm">
                    🔒 Connect your wallet to start this quest
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Timer */}
      {timeLeft !== null && !isCompleted && (
        <div className={`fixed bottom-8 right-8 z-[100] bg-black/90 backdrop-blur-xl border-2 ${timeLeft < 60 ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse' : 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]'} rounded-2xl p-6 transition-all duration-300 transform hover:scale-105`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl animate-bounce">⏱️</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 font-rajdhani">Time Remaining</span>
              <span className={`text-5xl font-bold font-orbitron tracking-wider ${timeLeft < 60 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
