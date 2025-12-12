import User from '../database/models/User';
import Progress from '../database/models/Progress';


export class ProfileService {
  /**
   * Get user profile with stats
   */
  static async getUserProfile(userId: string) {
    try {
      const user = await User.findById(userId)
        .populate('badges')
        .select('-__v')
        .lean();

      if (!user) {
        throw new Error('User not found');
      }

      const progress = await Progress.find({ userId }).lean();
      const completedQuests = progress.filter(p => p.status === 'COMPLETED').length;
      const inProgressQuests = progress.filter(p => p.status === 'IN_PROGRESS').length;
      const completedQuestIds = progress
        .filter(p => p.status === 'COMPLETED')
        .map(p => p.questId.toString());

      return {
        user,
        stats: {
          completedQuests,
          inProgressQuests,
          totalQuests: progress.length,
          badgesEarned: user.badges?.length || 0
        },
        completedQuestIds
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }

  /**
   * Get completed quest IDs for a user
   */
  static async getCompletedQuestIds(userId: string): Promise<string[]> {
    try {
      const progress = await Progress.find({ 
        userId, 
        status: 'COMPLETED' 
      }).select('questId').lean();
      
      return progress.map(p => p.questId.toString());
    } catch (error) {
      console.error('Error in getCompletedQuestIds:', error);
      throw error;
    }
  }

  /**
   * Update username
   */
  static async updateUsername(userId: string, username: string) {
    if (!username || username.length < 3 || username.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error('Username already taken');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true }
    );

    return user;
  }

  /**
   * Get user badges
   */
  static async getUserBadges(userId: string) {
    try {
      const user = await User.findById(userId)
        .populate('badges')
        .lean();
      
      if (!user) {
        throw new Error('User not found');
      }

      return user.badges || [];
    } catch (error) {
      console.error('Error in getUserBadges:', error);
      throw error;
    }
  }
}
