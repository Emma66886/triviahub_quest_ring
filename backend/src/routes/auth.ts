import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Authenticate with wallet signature (legacy endpoint)
router.post('/authenticate', AuthController.authenticate);

// Get nonce for wallet signing
router.post('/nonce', AuthController.generateNonce);

// Verify wallet signature and authenticate
router.post('/verify', AuthController.verifySignature);

// Get nonce for wallet signing (legacy endpoint - kept for backward compatibility)
router.get('/nonce/:walletAddress', AuthController.getLegacyNonce);

export default router;
