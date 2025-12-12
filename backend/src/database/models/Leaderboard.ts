import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILeaderboard extends Document {
  userId: Types.ObjectId;
  username: string;
  walletAddress: string;
  score: number;
  level: string;
  questsCompleted: number;
  badgesEarned: number;
  rank?: number;
  updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String
  },
  walletAddress: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  level: {
    type: String,
    required: true
  },
  questsCompleted: {
    type: Number,
    default: 0
  },
  badgesEarned: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

LeaderboardSchema.index({ score: -1 });
LeaderboardSchema.index({ questsCompleted: -1 });

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
