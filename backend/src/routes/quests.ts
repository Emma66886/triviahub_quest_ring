import { Router } from 'express';
import { authMiddleware } from '../utils/auth';
import { QuestController } from '../controllers/QuestController';

const router = Router();

// Create a new quest (authenticated users)
router.post('/', authMiddleware, QuestController.createQuest);

// Get all quests (public endpoint)
router.get('/', QuestController.getAllQuests);

// Get specific quest details (public)
router.get('/:questId', QuestController.getQuestById);

// Start a quest
router.post('/:questId/start', authMiddleware, QuestController.startQuest);

// Submit quest solution
router.post('/:questId/submit', authMiddleware, QuestController.submitQuest);

// Get hint for quest
router.post('/:questId/hint', authMiddleware, QuestController.getHint);

export default router;
