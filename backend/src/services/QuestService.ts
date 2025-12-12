import Quest from '../database/models/Quest';
import Progress from '../database/models/Progress';
import User from '../database/models/User';
import { Types } from 'mongoose';

export class QuestService {
  /**
   * Get all quests with optional filtering
   */
  static async getAllQuests(filter?: 'official' | 'community' | 'all', userId?: string) {
    const query: any = {};
    
    if (filter === 'official') {
      query.isOfficial = true;
    } else if (filter === 'community') {
      query.isOfficial = false;
    }

    const quests = await Quest.find(query)
      .sort({ isOfficial: -1, difficulty: 1, order: 1 })
      .select('-content.solution -content.blockData.correctOrder')
      .populate('createdBy', 'walletAddress')
      .lean();

    // If userId provided, attach progress info
    if (userId) {
      const progressRecords = await Progress.find({ userId }).lean();
      const progressMap = new Map(progressRecords.map(p => [p.questId.toString(), p]));
      
      return quests.map(quest => ({
        ...quest,
        progress: progressMap.get(quest._id.toString())
      }));
    }

    return quests;
  }

  /**
   * Get quest by ID
   */
  static async getQuestById(questId: string, userId?: string) {
    const quest = await Quest.findById(questId)
      .select('-content.solution -content.blockData.correctOrder')
      .populate('createdBy', 'walletAddress')
      .lean();
    
    if (!quest) {
      throw new Error('Quest not found');
    }

    // If userId provided, attach progress info
    if (userId) {
      const progress = await Progress.findOne({ userId, questId }).lean();
      return { ...quest, progress };
    }

    return quest;
  }

  /**
   * Create a new quest
   */
  static async createQuest(data: {
    title: string;
    description: string;
    difficulty: string;
    category: string;
    estimatedTime: number;
    availableBlocks: any[];
    correctOrder: string[];
    hint?: string;
    explanation?: string;
    userId: string;
  }) {
    const {
      title,
      description,
      difficulty,
      category,
      estimatedTime,
      availableBlocks,
      correctOrder,
      hint,
      explanation,
      userId
    } = data;

    // Calculate rewards based on difficulty
    const rewardMap: { [key: string]: { experience: number; sol: number } } = {
      NOVICE: { experience: 50, sol: 0.001 },
      EXPLORER: { experience: 100, sol: 0.002 },
      BUILDER: { experience: 200, sol: 0.005 },
      MASTER: { experience: 400, sol: 0.01 }
    };

    const rewards = rewardMap[difficulty] || rewardMap.NOVICE;

    return await Quest.create({
      title,
      description,
      difficulty,
      type: 'VISUAL_PROGRAMMING',
      category,
      experienceReward: rewards.experience,
      solReward: rewards.sol,
      order: 999,
      estimatedTime: estimatedTime || 10,
      content: {
        instructions: `Complete this community quest by arranging the blocks in the correct order.`,
        starterCode: '',
        hints: [hint || 'Think about the logical flow of operations'],
        concepts: ['Solana', 'Blockchain', 'Visual Programming'],
        blockData: {
          availableBlocks,
          correctOrder,
          explanation: explanation || 'Great job completing this quest!'
        }
      },
      createdBy: userId,
      isOfficial: false
    });
  }

  /**
   * Start a quest for a user
   */
  static async startQuest(questId: string, userId: string) {
    const quest = await Quest.findById(questId);
    
    if (!quest) {
      throw new Error('Quest not found');
    }

    // Check if already started
    let progress = await Progress.findOne({
      userId,
      questId: quest._id
    });

    if (progress && progress.status === 'COMPLETED') {
      return {
        alreadyCompleted: true,
        progress: {
          status: progress.status,
          attempts: progress.attempts,
          score: progress.score,
          completedAt: progress.completedAt
        }
      };
    }

    if (!progress) {
      progress = await Progress.create({
        userId,
        questId: quest._id,
        status: 'IN_PROGRESS'
      });
    } else {
      progress.status = 'IN_PROGRESS';
      progress.startedAt = new Date();
      await progress.save();
    }

    return {
      alreadyCompleted: false,
      progress: {
        status: progress.status,
        attempts: progress.attempts
      }
    };
  }

  /**
   * Submit quest solution
   */
  static async submitQuest(questId: string, userId: string, blockOrder: string[]) {
    const quest = await Quest.findById(questId);
    
    if (!quest) {
      throw new Error('Quest not found');
    }

    // Check if quest has blockData (visual programming type)
    if (!quest.content.blockData || !quest.content.blockData.correctOrder) {
      throw new Error('Quest does not support block-based submissions');
    }

    // Check if already completed
    let progress = await Progress.findOne({
      userId,
      questId: quest._id
    });

    if (progress && progress.status === 'COMPLETED') {
      throw new Error('Quest already completed');
    }

    if (!progress) {
      progress = await Progress.create({
        userId,
        questId: quest._id,
        status: 'IN_PROGRESS'
      });
    }

    progress.attempts += 1;
    progress.code = JSON.stringify(blockOrder);
    progress.updatedAt = new Date();

    // Validate block order
    const correctOrder = quest.content.blockData.correctOrder;
    const isCorrect = JSON.stringify(blockOrder) === JSON.stringify(correctOrder);

    if (isCorrect) {
      progress.status = 'COMPLETED';
      progress.completedAt = new Date();
      progress.score = Math.max(100 - (progress.attempts * 10) - (progress.hintsUsed * 5), 50);

      // Update user stats
      const user = await User.findById(userId);
      if (user) {
        user.experience += quest.experienceReward;
        user.playSolBalance += quest.solReward;
        user.totalScore += progress.score;
        
        if (!user.completedQuests.includes(quest._id)) {
          user.completedQuests.push(quest._id);
        }

        await user.save();
      }

      await progress.save();

      return {
        success: true,
        isCorrect: true,
        explanation: quest.content.blockData.explanation || 'Great job completing this quest!',
        progress: {
          status: progress.status,
          attempts: progress.attempts,
          score: progress.score
        },
        rewards: {
          experience: quest.experienceReward,
          sol: quest.solReward,
          score: progress.score
        }
      };
    } else {
      await progress.save();
      return {
        success: false,
        isCorrect: false,
        message: 'The block order is incorrect. Try again!',
        progress: {
          status: progress.status,
          attempts: progress.attempts
        }
      };
    }
  }

  /**
   * Get hint for a quest
   */
  static async getHint(questId: string, userId: string) {
    const quest = await Quest.findById(questId);
    
    if (!quest) {
      throw new Error('Quest not found');
    }

    let progress = await Progress.findOne({
      userId,
      questId: quest._id
    });

    if (!progress) {
      progress = await Progress.create({
        userId,
        questId: quest._id,
        status: 'IN_PROGRESS',
        hintsUsed: 1
      });
    } else {
      progress.hintsUsed += 1;
      await progress.save();
    }

    const hintIndex = Math.min(progress.hintsUsed - 1, quest.content.hints.length - 1);
    const hint = quest.content.hints[hintIndex];

    return { hint, hintsUsed: progress.hintsUsed };
  }
}
