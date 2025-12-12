import mongoose, { Schema, Document, Types } from 'mongoose';

export enum DifficultyLevel {
  NOVICE = 'NOVICE',
  EXPLORER = 'EXPLORER',
  BUILDER = 'BUILDER',
  MASTER = 'MASTER'
}

export interface IUser extends Document {
  walletAddress: string;
  username?: string;
  currentLevel: DifficultyLevel;
  experience: number;
  playSolBalance: number;
  devnetWalletAddress?: string;
  joinedAt: Date;
  lastActive: Date;
  completedQuests: Types.ObjectId[];
  badges: Types.ObjectId[];
  totalScore: number;
  streak: number;
  lastStreakDate?: Date;
}

const UserSchema = new Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  currentLevel: {
    type: String,
    enum: Object.values(DifficultyLevel),
    default: DifficultyLevel.NOVICE
  },
  experience: {
    type: Number,
    default: 0
  },
  playSolBalance: {
    type: Number,
    default: 10
  },
  devnetWalletAddress: {
    type: String
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  completedQuests: [{
    type: Schema.Types.ObjectId,
    ref: 'Quest'
  }],
  badges: [{
    type: Schema.Types.ObjectId,
    ref: 'Badge'
  }],
  totalScore: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastStreakDate: {
    type: Date
  }
});

UserSchema.index({ totalScore: -1 });
UserSchema.index({ experience: -1 });

export default mongoose.model<IUser>('User', UserSchema);
