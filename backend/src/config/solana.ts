import { Connection, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

export const SOLANA_NETWORK = 'devnet';
export const connection = new Connection(
  process.env.SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK),
  'confirmed'
);

export const PLAY_SOL_AIRDROP_AMOUNT = 10; // Amount of SOL to airdrop for new users
