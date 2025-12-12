import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string;
  requirement: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  nftMetadata?: {
    mintAddress?: string;
    imageUri: string;
    attributes: Record<string, any>;
  };
  createdAt: Date;
}

const BadgeSchema = new Schema<IBadge>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  requirement: {
    type: String,
    required: true
  },
  rarity: {
    type: String,
    enum: ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'],
    default: 'COMMON'
  },
  nftMetadata: {
    mintAddress: String,
    imageUri: String,
    attributes: Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IBadge>('Badge', BadgeSchema);
