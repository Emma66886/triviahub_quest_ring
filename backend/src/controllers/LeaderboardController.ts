import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { LeaderboardService } from '../services/LeaderboardService';

export class LeaderboardController {
  /**
   * Get global leaderboard
   * GET /api/leaderboard
   */
  static async getLeaderboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await LeaderboardService.getGlobalLeaderboard(limit);

      res.json({ leaderboard });
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  /**
   * Get user's rank
   * GET /api/leaderboard/my-rank
   */
  static async getUserRank(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await LeaderboardService.getUserRank(req.userId!);
      res.json(result);
    } catch (error: any) {
      console.error('Get rank error:', error);
      
      if (error.message === 'User not found') {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to fetch rank' });
    }
  }

  /**
   * Update leaderboard (admin/cron job)
   * POST /api/leaderboard/update
   */
  static async updateLeaderboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await LeaderboardService.updateLeaderboard();
      res.json(result);
    } catch (error) {
      console.error('Update leaderboard error:', error);
      res.status(500).json({ error: 'Failed to update leaderboard' });
    }
  }
}
