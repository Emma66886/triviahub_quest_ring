import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProgress extends Document {
  userId: Types.ObjectId;
  questId: Types.ObjectId;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  attempts: number;
  hintsUsed: number;
  timeSpent: number; // in seconds
  code?: string;
  completedAt?: Date;
  score: number;
  startedAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questId: {
    type: Schema.Types.ObjectId,
    ref: 'Quest',
    required: true
  },
  status: {
    type: String,
    enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
    default: 'NOT_STARTED'
  },
  attempts: {
    type: Number,
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  code: {
    type: String
  },
  completedAt: {
    type: Date
  },
  score: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ProgressSchema.index({ userId: 1, questId: 1 }, { unique: true });
ProgressSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IProgress>('Progress', ProgressSchema);
