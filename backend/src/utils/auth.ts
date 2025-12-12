import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  userId?: string;
  walletAddress?: string;
}

export const generateToken = (walletAddress: string, userId: string): string => {
  return jwt.sign(
    { walletAddress, userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyWalletSignature = (
  publicKey: string,
  signature: string,
  message: string
): boolean => {
  try {
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);

    // Solana wallets use Ed25519, which is nacl.sign.detached
    // But we need to verify with the correct format
    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    
    console.log('Signature verification:', {
      publicKey: publicKey.substring(0, 8) + '...',
      signatureLength: signatureBytes.length,
      messageLength: messageBytes.length,
      verified
    });
    
    return verified;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Request path:", req.path);
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.userId = decoded.userId;
    req.walletAddress = decoded.walletAddress;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
