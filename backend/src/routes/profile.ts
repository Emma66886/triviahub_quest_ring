import { Router } from 'express';
import { authMiddleware } from '../utils/auth';
import { ProfileController } from '../controllers/ProfileController';

const router = Router();

// Get user profile
router.get('/me', authMiddleware, ProfileController.getProfile);

// Get completed quest IDs
router.get('/completed-quests', authMiddleware, ProfileController.getCompletedQuestIds);

// Update username
router.patch('/username', authMiddleware, ProfileController.updateUsername);

// Get user badges
router.get('/badges', authMiddleware, ProfileController.getBadges);

export default router;
