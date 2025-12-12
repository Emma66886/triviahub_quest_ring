import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { ProfileService } from '../services/ProfileService';

export class ProfileController {
  /**
   * Get user profile
   * GET /api/profile/me
   */
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log('Fetching profile for userId:', req.userId);
      const result = await ProfileService.getUserProfile(req.userId!);
      res.json(result);
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      if (error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  /**
   * Update username
   * PATCH /api/profile/username
   */
  static async updateUsername(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { username } = req.body;
      const user = await ProfileService.updateUsername(req.userId!, username);

      res.json({ user });
    } catch (error: any) {
      console.error('Update username error:', error);
      
      if (error.message === 'Username must be between 3 and 20 characters') {
        res.status(400).json({ error: error.message });
        return;
      }
      
      if (error.message === 'Username already taken') {
        res.status(400).json({ error: 'Username already taken' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to update username' });
    }
  }

  /**
   * Get completed quest IDs
   * GET /api/profile/completed-quests
   */
  static async getCompletedQuestIds(req: AuthRequest, res: Response): Promise<void> {
    try {
      const completedQuestIds = await ProfileService.getCompletedQuestIds(req.userId!);
      res.json({ completedQuestIds });
    } catch (error: any) {
      console.error('Get completed quests error:', error);
      res.status(500).json({ error: 'Failed to fetch completed quests' });
    }
  }

  /**
   * Get user badges
   * GET /api/profile/badges
   */
  static async getBadges(req: AuthRequest, res: Response): Promise<void> {
    try {
      const badges = await ProfileService.getUserBadges(req.userId!);
      res.json({ badges });
    } catch (error: any) {
      console.error('Get badges error:', error);
      
      if (error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to fetch badges' });
    }
  }
}
