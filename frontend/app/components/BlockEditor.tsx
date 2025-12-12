'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, X, Lightbulb, Play, RefreshCw, Sparkles, Move } from 'lucide-react';
import { useSound } from './SoundContext';

interface Block {
  id: string;
  text: string;
  icon: string;
  color: string;
}

interface QuestData {
  availableBlocks: Block[];
  slots: number;
  hint: string;
  explanation?: string;
}

export default function BlockEditor({ 
  questData,
  onSubmit,
  isCompleted
}: { 
  questData: QuestData;
  onSubmit?: (blockOrder: string[]) => Promise<{ success: boolean; isCorrect: boolean; message?: string; explanation?: string }>;
  isCompleted?: boolean;
}) {
  const { playHover, playClick, playSuccess, playError } = useSound();
  const initialBlocks = useMemo(() => Array(questData.slots).fill(null), [questData.slots]);
  const [droppedBlocks, setDroppedBlocks] = useState<(Block | null)[]>(initialBlocks);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [touchBlock, setTouchBlock] = useState<Block | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragStart = (block: Block) => {
    if (!isBlockUsed(block.id) && !feedback && !isCompleted) {
      playHover();
      setDraggedBlock(block);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedBlock && !droppedBlocks[index]) {
      playClick();
      const newDropped = [...droppedBlocks];
      newDropped[index] = draggedBlock;
      setDroppedBlocks(newDropped);
      setDraggedBlock(null);
    }
  };

  const handleTouchBlock = (block: Block) => {
    if (isBlockUsed(block.id) || feedback || isCompleted) return;
    playHover();
    setTouchBlock(block);
  };

  const handleSlotTap = (index: number) => {
    if (!touchBlock || droppedBlocks[index]) return;
    
    playClick();
    const newDropped = [...droppedBlocks];
    newDropped[index] = touchBlock;
    setDroppedBlocks(newDropped);
    setTouchBlock(null);
  };

  const handleRemoveBlock = (index: number) => {
    playClick();
    const newDropped = [...droppedBlocks];
    newDropped[index] = null;
    setDroppedBlocks(newDropped);
  };

  const isBlockUsed = (blockId: string) => {
    return droppedBlocks.some(block => block && block.id === blockId);
  };

  const checkAnswer = async () => {
    const userOrder = droppedBlocks.filter(b => b).map(b => b!.id);
    
    playClick();
    
    if (!onSubmit) {
      // Fallback for testing without backend
      setFeedback('correct');
      setFeedbackMessage(questData.explanation || 'Great job!');
      return;
    }

    setIsExecuting(true);
    
    try {
      const result = await onSubmit(userOrder);
      
      setTimeout(() => {
        setIsExecuting(false);
        
        if (result.isCorrect) {
          setFeedback('correct');
          setFeedbackMessage(result.explanation || questData.explanation || 'Great job completing this quest!');
        } else {
          setFeedback('incorrect');
          setFeedbackMessage(result.message || 'The block order is incorrect. Try again!');
        }
      }, 2000);
    } catch (error) {
      setIsExecuting(false);
      setFeedback('incorrect');
      setFeedbackMessage('Failed to submit. Please try again.');
    }
  };

  const resetLevel = () => {
    playClick();
    setDroppedBlocks(Array(questData.slots).fill(null));
    setFeedback(null);
    setShowHint(false);
    setTouchBlock(null);
    setDraggedBlock(null);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Instructions */}
      {isMobile && touchBlock && (
        <div className="bg-yellow-400 text-gray-900 rounded-xl p-4 font-bold text-center animate-pulse">
          <Move size={20} className="inline mr-2" />
          Tap a slot below to place this block
        </div>
      )}

      {/* Completed Banner */}
      {isCompleted && (
        <div className="bg-green-600/20 border-2 border-green-500 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-green-400 font-bold text-lg">Quest Completed!</p>
          <p className="text-gray-300 text-sm mt-2">You've already mastered this challenge.</p>
        </div>
      )}

      {/* Available Blocks */}
      <div className={isCompleted ? 'opacity-50 pointer-events-none' : ''}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          Available Blocks
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {questData.availableBlocks.map((block) => (
            <div
              key={block.id}
              draggable={!isBlockUsed(block.id) && !feedback && !isMobile}
              onDragStart={() => !isMobile && handleDragStart(block)}
              onClick={() => isMobile && handleTouchBlock(block)}
              onMouseEnter={playHover}
              className={`p-4 rounded-xl font-medium transition-all ${
                isBlockUsed(block.id)
                  ? 'bg-gray-700 text-gray-500 opacity-50'
                  : touchBlock?.id === block.id
                  ? `${block.color} ring-4 ring-yellow-300 scale-105 shadow-lg`
                  : `${block.color} hover:shadow-lg active:scale-95`
              } ${!isMobile && !isBlockUsed(block.id) && !feedback ? 'cursor-move' : ''} ${isMobile && !isBlockUsed(block.id) && !feedback ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center gap-3 text-white">
                <span className="text-2xl">{block.icon}</span>
                <span>{block.text}</span>
                {isMobile && !isBlockUsed(block.id) && !feedback && (
                  <Move size={16} className="ml-auto opacity-70" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div className={isCompleted ? 'opacity-50 pointer-events-none' : ''}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Move size={18} className="text-cyan-400" />
          Build Your Solution
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: questData.slots }).map((_, index) => (
            <div
              key={index}
              onDragOver={!isMobile ? handleDragOver : undefined}
              onDrop={!isMobile ? (e) => handleDrop(e, index) : undefined}
              onClick={() => isMobile && handleSlotTap(index)}
              className={`min-h-[70px] rounded-xl border-3 border-dashed transition-all flex items-center justify-center ${
                droppedBlocks[index]
                  ? 'bg-green-900/30 border-green-500'
                  : touchBlock && !droppedBlocks[index]
                  ? 'bg-yellow-900/30 border-yellow-500 animate-pulse'
                  : 'bg-gray-800 border-gray-600 active:border-blue-400 active:bg-blue-900/30'
              } ${isMobile && !droppedBlocks[index] && touchBlock ? 'cursor-pointer' : ''}`}
            >
              {droppedBlocks[index] ? (
                <div className={`w-full p-4 ${droppedBlocks[index]!.color} rounded-lg flex items-center justify-between`}>
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-2xl">{droppedBlocks[index]!.icon}</span>
                    <span className="font-medium">{droppedBlocks[index]!.text}</span>
                  </div>
                  {!feedback && !isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBlock(index);
                      }}
                      className="text-white hover:text-red-200 active:scale-90 p-1"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-gray-500 font-medium px-4 text-center">
                  {isMobile && touchBlock ? 'Tap here to place' : `Drop block ${index + 1} here`}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Executing Animation */}
      {isExecuting && (
        <div className="bg-blue-900/50 border-2 border-blue-500 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <RefreshCw className="text-blue-400 animate-spin" size={20} />
            <span className="text-xl font-bold text-blue-300">Executing on Solana Devnet...</span>
          </div>
          <p className="text-gray-400">Broadcasting transaction to the blockchain</p>
        </div>
      )}

      {/* Feedback */}
      {feedback && !isExecuting && (
        <div className={`rounded-xl p-6 ${
          feedback === 'correct' ? 'bg-green-900/50 border-2 border-green-500' : 'bg-red-900/50 border-2 border-red-500'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            {feedback === 'correct' ? (
              <Check className="text-green-400 shrink-0" size={24} />
            ) : (
              <X className="text-red-400 shrink-0" size={24} />
            )}
            <div>
              <h4 className={`font-bold text-lg mb-2 ${
                feedback === 'correct' ? 'text-green-300' : 'text-red-300'
              }`}>
                {feedback === 'correct' ? 'Transaction Successful! 🎉' : 'Transaction Failed! 💡'}
              </h4>
              <p className="text-gray-300">{feedbackMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      {!feedback && (
        <button
          onClick={() => {
            playClick();
            setShowHint(!showHint);
          }}
          onMouseEnter={playHover}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
        >
          <Lightbulb size={18} />
          {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      )}

      {showHint && !feedback && !isCompleted && (
        <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-xl p-4">
          <p className="text-gray-300">{questData.hint}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!feedback && !isCompleted && (
          <>
            <button
              onClick={checkAnswer}
              onMouseEnter={playHover}
              disabled={droppedBlocks.filter(b => b).length !== questData.slots}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                droppedBlocks.filter(b => b).length === questData.slots
                  ? 'bg-linear-to-r from-green-600 to-blue-600 text-white hover:shadow-lg active:scale-95'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play size={20} />
              Execute
            </button>
            <button
              onClick={resetLevel}
              onMouseEnter={playHover}
              className="px-6 py-4 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-600 active:bg-gray-800 transition-all"
            >
              <RefreshCw size={18} />
            </button>
          </>
        )}
        
        {feedback && (
          <button
            onClick={resetLevel}
            onMouseEnter={playHover}
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-all"
          >
            {feedback === 'correct' ? 'Continue' : 'Try Again'}
          </button>
        )}
        
        {isCompleted && !feedback && (
          <div className="flex-1 bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-center">
            ✅ Quest Completed!
          </div>
        )}
      </div>
    </div>
  );
}
