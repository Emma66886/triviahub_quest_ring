'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Plus, Trash2, Save, ArrowLeft, Sparkles, Move } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useSound } from '../components/SoundContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Block {
  id: string;
  text: string;
  icon: string;
  color: string;
}

export default function CreateQuest() {
  const router = useRouter();
  const { connected } = useWallet();
  const { isAuthenticated, authToken, login } = useAuth();
  const { playHover, playClick, playSuccess, playError } = useSound();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('NOVICE');
  const [category, setCategory] = useState('ACCOUNTS');
  const [estimatedTime, setEstimatedTime] = useState(10);
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  
  // Block state
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 'block1', text: '', icon: '🔵', color: 'bg-blue-500' }
  ]);
  const [correctOrder, setCorrectOrder] = useState<string[]>(['block1']);

  const addBlock = () => {
    playClick();
    const newBlockId = `block${blocks.length + 1}`;
    setBlocks([...blocks, {
      id: newBlockId,
      text: '',
      icon: '🔵',
      color: 'bg-blue-500'
    }]);
    setCorrectOrder([...correctOrder, newBlockId]);
  };

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return;
    playClick();
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    setCorrectOrder(newBlocks.map(b => b.id));
  };

  const updateBlock = (index: number, field: keyof Block, value: string) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    setBlocks(newBlocks);
  };

  const moveBlockOrder = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...correctOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setCorrectOrder(newOrder);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    // Validate blocks have text
    if (blocks.some(b => !b.text.trim())) {
      alert('All blocks must have text!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/quests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          category,
          estimatedTime,
          availableBlocks: blocks,
          correctOrder,
          hint,
          explanation
        }),
      });

      const data = await response.json();

      if (data.success) {
        playSuccess();
        alert('✅ Quest created successfully!');
        router.push('/');
      } else {
        playError();
        alert(`❌ ${data.error || 'Failed to create quest'}`);
      }
    } catch (error) {
      playError();
      console.error('Error creating quest:', error);
      alert('Error creating quest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = ['🔵', '🟣', '🟢', '🟡', '🔴', '⭐', '🔑', '💰', '🔌', '📋', '💎', '🎨', '⚡', '🏦', '❄️', '🚀'];
  const colorOptions = [
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Pink', value: 'bg-pink-500' },
    { name: 'Cyan', value: 'bg-cyan-500' },
    { name: 'Orange', value: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
              <ArrowLeft size={20} />
              <span className="font-bold">Back to Quests</span>
            </button>
            <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Create Quest
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!connected && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-none p-6 mb-6 text-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <p className="text-yellow-400 font-bold font-orbitron tracking-wider uppercase">⚠️ Please connect your wallet to create a quest</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="game-border bg-black/40 backdrop-blur-sm p-6 relative group">
              <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-orbitron text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">
                <Sparkles className="text-purple-400" size={24} />
                Quest Information
              </h2>

              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2 font-rajdhani uppercase tracking-wider">
                    Quest Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-black/60 text-white rounded-none px-4 py-3 border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all font-rajdhani"
                    placeholder="e.g., Connect to Solana Devnet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2 font-rajdhani uppercase tracking-wider">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-black/60 text-white rounded-none px-4 py-3 border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all font-rajdhani"
                    placeholder="Describe what users will learn in this quest..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2 font-rajdhani uppercase tracking-wider">
                      Difficulty *
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-black/60 text-white rounded-none px-4 py-3 border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all font-rajdhani"
                    >
                      <option value="NOVICE">Novice</option>
                      <option value="EXPLORER">Explorer</option>
                      <option value="BUILDER">Builder</option>
                      <option value="MASTER">Master</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2 font-rajdhani uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/60 text-white rounded-none px-4 py-3 border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all font-rajdhani"
                    >
                      <option value="ACCOUNTS">Accounts</option>
                      <option value="TRANSACTIONS">Transactions</option>
                      <option value="PROGRAMS">Programs</option>
                      <option value="PDAS">PDAs</option>
                      <option value="TOKENS">Tokens</option>
                      <option value="NFTS">NFTs</option>
                      <option value="DEFI">DeFi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-cyan-400 mb-2 font-rajdhani uppercase tracking-wider">
                      Estimated Time (min)
                    </label>
                    <input
                      type="number"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 10)}
                      min="1"
                      max="120"
                      className="w-full bg-black/60 text-white rounded-none px-4 py-3 border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all font-rajdhani"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Blocks */}
            <div className="game-border bg-black/40 backdrop-blur-sm p-6 relative group">
              <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-2xl font-bold flex items-center gap-2 font-orbitron text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">
                  🧩 Quest Blocks
                </h2>
                <button
                  type="button"
                  onClick={addBlock}
                  onMouseEnter={playHover}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-purple-100 rounded-none font-bold transition-all font-rajdhani uppercase tracking-wider hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  <Plus size={18} />
                  Add Block
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                {blocks.map((block, index) => (
                  <div key={block.id} className="bg-black/60 rounded-none p-4 border border-gray-700 hover:border-purple-500/50 transition-colors group/block">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-cyan-400 font-rajdhani uppercase">Order #{correctOrder.indexOf(block.id) + 1}</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlockOrder(correctOrder.indexOf(block.id), 'up')}
                            disabled={correctOrder.indexOf(block.id) === 0}
                            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 disabled:opacity-30 disabled:border-transparent rounded-none text-xs text-cyan-400 transition-colors"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlockOrder(correctOrder.indexOf(block.id), 'down')}
                            disabled={correctOrder.indexOf(block.id) === correctOrder.length - 1}
                            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 disabled:opacity-30 disabled:border-transparent rounded-none text-xs text-cyan-400 transition-colors"
                          >
                            ↓
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 font-rajdhani uppercase">
                            Block Text *
                          </label>
                          <input
                            type="text"
                            value={block.text}
                            onChange={(e) => updateBlock(index, 'text', e.target.value)}
                            required
                            className="w-full bg-gray-900/50 text-white rounded-none px-3 py-2 border border-gray-700 focus:border-purple-500/50 focus:outline-none focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all font-rajdhani"
                            placeholder="e.g., Connect to Network"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 font-rajdhani uppercase">
                            Icon
                          </label>
                          <select
                            value={block.icon}
                            onChange={(e) => updateBlock(index, 'icon', e.target.value)}
                            className="w-full bg-gray-900/50 text-white rounded-none px-3 py-2 border border-gray-700 focus:border-purple-500/50 focus:outline-none focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all font-rajdhani"
                          >
                            {iconOptions.map(icon => (
                              <option key={icon} value={icon}>{icon} {icon}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1 font-rajdhani uppercase">
                            Color
                          </label>
                          <div className="flex gap-2">
                            {colorOptions.map(color => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => updateBlock(index, 'color', color.value)}
                                className={`w-8 h-8 rounded-none ${color.value} ${block.color === color.value ? 'ring-2 ring-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'opacity-70 hover:opacity-100'} transition-all`}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            disabled={blocks.length <= 1}
                            className="w-full px-4 py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-none flex items-center justify-center gap-2 transition-all font-rajdhani uppercase tracking-wider"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <span className="text-xs font-bold text-gray-500 mb-2 block font-rajdhani uppercase">Preview:</span>
                      <div className={`${block.color} rounded-none p-3 flex items-center gap-3 border border-white/10`}>
                        <span className="text-2xl drop-shadow-md">{block.icon}</span>
                        <span className="font-medium text-white font-rajdhani tracking-wide">{block.text || 'Block text here...'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints & Feedback */}
            <div className="game-border bg-black/40 backdrop-blur-sm p-6 relative group">
              <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h2 className="text-2xl font-bold mb-6 font-orbitron text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400 relative z-10">
                💡 Learning Support
              </h2>

              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2 font-rajdhani uppercase tracking-wider">
                    Hint
                  </label>
                  <textarea
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    rows={2}
                    className="w-full bg-black/60 text-white rounded-none px-4 py-3 border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all font-rajdhani"
                    placeholder="Give users a helpful hint about the correct order..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2 font-rajdhani uppercase tracking-wider">
                    Success Explanation
                  </label>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={2}
                    className="w-full bg-black/60 text-white rounded-none px-4 py-3 border border-purple-500/30 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all font-rajdhani"
                    placeholder="Explain what users learned when they complete the quest..."
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !connected}
                onMouseEnter={playHover}
                className="flex-1 bg-linear-to-r from-purple-600 to-cyan-600 text-white py-4 rounded-none font-bold text-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-orbitron uppercase tracking-widest border border-white/20"
              >
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save size={20} />
                    Create Quest
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
