import express from 'express';
import  './database/models/Badge';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import questRoutes from './routes/quests';
import leaderboardRoutes from './routes/leaderboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', (req, res, next) => {
  console.log("Profile route accessed:", req.path);
  next();
}, profileRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Quest Ring Backend running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
