import Leaderboard from '../database/models/Leaderboard';
import User from '../database/models/User';

export class LeaderboardService {
  /**
   * Get global leaderboard
   */
  static async getGlobalLeaderboard(limit: number = 100) {
    const leaderboard = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(limit)
      .select('-__v');

    // Assign ranks
    return leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));
  }

  /**
   * Get user's rank
   */
  static async getUserRank(userId: string) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const higherRankedUsers = await User.countDocuments({
      totalScore: { $gt: user.totalScore }
    });

    const rank = higherRankedUsers + 1;

    return {
      rank,
      score: user.totalScore,
      username: user.username,
      walletAddress: user.walletAddress
    };
  }

  /**
   * Update leaderboard (for admin/cron job)
   */
  static async updateLeaderboard() {
    const users = await User.find().select('walletAddress username totalScore currentLevel completedQuests badges');

    const bulkOps = users.map(user => ({
      updateOne: {
        filter: { userId: user._id },
        update: {
          $set: {
            userId: user._id,
            username: user.username || 'Anonymous',
            walletAddress: user.walletAddress,
            score: user.totalScore,
            level: user.currentLevel,
            questsCompleted: user.completedQuests.length,
            badgesEarned: user.badges.length,
            updatedAt: new Date()
          }
        },
        upsert: true
      }
    }));

    if (bulkOps.length > 0) {
      await Leaderboard.bulkWrite(bulkOps);
    }

    return { message: 'Leaderboard updated successfully' };
  }
}
