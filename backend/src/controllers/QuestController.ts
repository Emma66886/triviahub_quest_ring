import { Response } from 'express';
import { AuthRequest } from '../utils/auth';
import { QuestService } from '../services/QuestService';

export class QuestController {
  /**
   * Create a new quest (authenticated users)
   * POST /api/quests
   */
  static async createQuest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        difficulty,
        category,
        estimatedTime,
        availableBlocks,
        correctOrder,
        hint,
        explanation
      } = req.body;

      // Validate required fields
      if (!title || !description || !difficulty || !category || !availableBlocks || !correctOrder) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const quest = await QuestService.createQuest({
        title,
        description,
        difficulty,
        category,
        estimatedTime,
        availableBlocks,
        correctOrder,
        hint,
        explanation,
        userId: req.userId!
      });

      res.status(201).json({ 
        success: true,
        quest,
        message: 'Quest created successfully!' 
      });
    } catch (error) {
      console.error('Create quest error:', error);
      res.status(500).json({ error: 'Failed to create quest' });
    }
  }

  /**
   * Get all quests (public endpoint)
   * GET /api/quests
   */
  static async getAllQuests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { filter } = req.query;
      const userId = req.userId; // May be undefined for unauthenticated requests
      const quests = await QuestService.getAllQuests(filter as any, userId);

      res.json({ quests });
    } catch (error) {
      console.error('Get quests error:', error);
      res.status(500).json({ error: 'Failed to fetch quests' });
    }
  }

  /**
   * Get specific quest details (public)
   * GET /api/quests/:questId
   */
  static async getQuestById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId; // May be undefined for unauthenticated requests
      const quest = await QuestService.getQuestById(req.params.questId, userId);
      res.json({ quest });
    } catch (error: any) {
      console.error('Get quest error:', error);
      
      if (error.message === 'Quest not found') {
        res.status(404).json({ error: 'Quest not found' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to fetch quest' });
    }
  }

  /**
   * Start a quest
   * POST /api/quests/:questId/start
   */
  static async startQuest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await QuestService.startQuest(req.params.questId, req.userId!);
      
      if (result.alreadyCompleted) {
        res.status(200).json({ 
          message: 'Quest already completed',
          alreadyCompleted: true,
          progress: result.progress 
        });
        return;
      }
      
      res.json({ progress: result.progress });
    } catch (error: any) {
      console.error('Start quest error:', error);
      
      if (error.message === 'Quest not found') {
        res.status(404).json({ error: 'Quest not found' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to start quest' });
    }
  }

  /**
   * Submit quest solution
   * POST /api/quests/:questId/submit
   */
  static async submitQuest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { blockOrder } = req.body;
      
      if (!blockOrder || !Array.isArray(blockOrder)) {
        res.status(400).json({ error: 'Block order is required and must be an array' });
        return;
      }
      
      const result = await QuestService.submitQuest(req.params.questId, req.userId!, blockOrder);

      res.json(result);
    } catch (error: any) {
      console.error('Submit quest error:', error);
      
      if (error.message === 'Quest not found') {
        res.status(404).json({ error: 'Quest not found' });
        return;
      }
      
      if (error.message === 'Quest already completed') {
        res.status(400).json({ error: 'Quest already completed', alreadyCompleted: true });
        return;
      }
      
      if (error.message === 'Quest does not support block-based submissions') {
        res.status(400).json({ error: 'Quest does not support block-based submissions' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to submit quest' });
    }
  }

  /**
   * Get hint for quest
   * POST /api/quests/:questId/hint
   */
  static async getHint(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await QuestService.getHint(req.params.questId, req.userId!);
      res.json(result);
    } catch (error: any) {
      console.error('Get hint error:', error);
      
      if (error.message === 'Quest not found') {
        res.status(404).json({ error: 'Quest not found' });
        return;
      }
      
      res.status(500).json({ error: 'Failed to get hint' });
    }
  }
}
