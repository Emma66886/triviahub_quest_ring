import User from '../database/models/User';
import { verifyWalletSignature, generateToken } from '../utils/auth';
import { PLAY_SOL_AIRDROP_AMOUNT } from '../config/solana';

export class AuthService {
  /**
   * Generate a nonce for wallet signature
   */
  static generateNonce(publicKey: string): string {
    const timestamp = Date.now();
    return `${timestamp}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Verify wallet signature and authenticate user
   */
  static async verifyAndAuthenticate(
    publicKey: string,
    signature: string,
    message: string
  ): Promise<{ token: string; user: any }> {
    // Verify the signature
    const isValid = verifyWalletSignature(publicKey, signature, message);

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: publicKey });

    if (!user) {
      user = await User.create({
        walletAddress: publicKey,
        playSolBalance: PLAY_SOL_AIRDROP_AMOUNT,
        lastActive: new Date()
      });
    } else {
      user.lastActive = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(publicKey, user._id.toString());

    return {
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        username: user.username,
        currentLevel: user.currentLevel,
        experience: user.experience,
        playSolBalance: user.playSolBalance,
        totalScore: user.totalScore,
        streak: user.streak
      }
    };
  }

  /**
   * Generate legacy nonce (for backward compatibility)
   */
  static generateLegacyNonce(walletAddress: string): string {
    const timestamp = Date.now();
    return `Sign this message to authenticate with Quest Ring: ${timestamp}`;
  }
}
