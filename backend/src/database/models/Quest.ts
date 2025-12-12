import mongoose, { Schema, Document, Types } from 'mongoose';
import { DifficultyLevel } from './User';

export enum QuestType {
  VISUAL_PROGRAMMING = 'VISUAL_PROGRAMMING',
  CODE_COMPLETION = 'CODE_COMPLETION',
  BUILD_FROM_SCRATCH = 'BUILD_FROM_SCRATCH',
  DEBUG_CHALLENGE = 'DEBUG_CHALLENGE',
  MINI_GAME = 'MINI_GAME'
}

export enum QuestCategory {
  ACCOUNTS = 'ACCOUNTS',
  TRANSACTIONS = 'TRANSACTIONS',
  PROGRAMS = 'PROGRAMS',
  PDAS = 'PDAS',
  TOKENS = 'TOKENS',
  NFTS = 'NFTS',
  DEFI = 'DEFI'
}

export interface IQuest extends Document {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  type: QuestType;
  category: QuestCategory;
  experienceReward: number;
  solReward: number;
  order: number;
  prerequisites: Types.ObjectId[];
  estimatedTime: number; // in minutes
  content: {
    instructions: string;
    starterCode?: string;
    solution?: string;
    hints: string[];
    concepts: string[];
    videoUrl?: string;
    blockData?: {
      availableBlocks: Array<{ id: string; text: string; icon: string; color: string }>;
      correctOrder: string[];
      explanation?: string;
    };
  };
  testCases?: {
    input: any;
    expectedOutput: any;
  }[];
  createdBy?: Types.ObjectId;
  isOfficial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestSchema = new Schema<IQuest>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: Object.values(DifficultyLevel),
    required: true
  },
  type: {
    type: String,
    enum: Object.values(QuestType),
    required: true
  },
  category: {
    type: String,
    enum: Object.values(QuestCategory),
    required: true
  },
  experienceReward: {
    type: Number,
    required: true
  },
  solReward: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  prerequisites: [{
    type: Schema.Types.ObjectId,
    ref: 'Quest'
  }],
  estimatedTime: {
    type: Number,
    required: true
  },
  content: {
    instructions: String,
    starterCode: String,
    solution: String,
    hints: [String],
    concepts: [String],
    videoUrl: String,
    blockData: {
      availableBlocks: [{
        id: String,
        text: String,
        icon: String,
        color: String
      }],
      correctOrder: [String],
      explanation: String
    }
  },
  testCases: [{
    input: Schema.Types.Mixed,
    expectedOutput: Schema.Types.Mixed
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

QuestSchema.index({ difficulty: 1, order: 1 });

export default mongoose.model<IQuest>('Quest', QuestSchema);
