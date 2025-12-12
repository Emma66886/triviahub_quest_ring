import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  /**
   * Generate nonce for wallet signing
   * POST /api/auth/nonce
   */
  static async generateNonce(req: Request, res: Response): Promise<void> {
    try {
      const { publicKey } = req.body;
      
      if (!publicKey) {
        res.status(400).json({ error: 'Public key required' });
        return;
      }
      
      const nonce = AuthService.generateNonce(publicKey);
      
      res.json({ nonce });
    } catch (error) {
      console.error('Nonce generation error:', error);
      res.status(500).json({ error: 'Failed to generate nonce' });
    }
  }

  /**
   * Verify wallet signature and authenticate
   * POST /api/auth/verify
   */
  static async verifySignature(req: Request, res: Response): Promise<void> {
    try {
      const { publicKey, signature, message } = req.body;

      console.log('Authentication attempt:', {
        publicKey: publicKey?.substring(0, 8) + '...',
        hasSignature: !!signature,
        hasMessage: !!message,
        messagePreview: message?.substring(0, 50)
      });

      if (!publicKey || !signature || !message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const result = await AuthService.verifyAndAuthenticate(publicKey, signature, message);
      
      res.json(result);
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (error.message === 'Invalid signature') {
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }
      
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  /**
   * Legacy authenticate endpoint (for backward compatibility)
   * POST /api/auth/authenticate
   */
  static async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { walletAddress, signature, message } = req.body;

      console.log('Authentication attempt:', {
        walletAddress: walletAddress?.substring(0, 8) + '...',
        hasSignature: !!signature,
        hasMessage: !!message,
        messagePreview: message?.substring(0, 50)
      });

      if (!walletAddress || !signature || !message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const result = await AuthService.verifyAndAuthenticate(walletAddress, signature, message);
      
      res.json(result);
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (error.message === 'Invalid signature') {
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }
      
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  /**
   * Legacy nonce endpoint (for backward compatibility)
   * GET /api/auth/nonce/:walletAddress
   */
  static async getLegacyNonce(req: Request, res: Response): Promise<void> {
    try {
      const { walletAddress } = req.params;
      const nonce = AuthService.generateLegacyNonce(walletAddress);
      
      res.json({ nonce });
    } catch (error) {
      console.error('Nonce generation error:', error);
      res.status(500).json({ error: 'Failed to generate nonce' });
    }
  }
}
