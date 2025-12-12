import { Router } from 'express';
import { authMiddleware } from '../utils/auth';
import { LeaderboardController } from '../controllers/LeaderboardController';

const router = Router();

// Get global leaderboard
router.get('/', LeaderboardController.getLeaderboard);

// Get user's rank
router.get('/my-rank', authMiddleware, LeaderboardController.getUserRank);

// Update leaderboard (admin/cron job)
router.post('/update', LeaderboardController.updateLeaderboard);

export default router;
