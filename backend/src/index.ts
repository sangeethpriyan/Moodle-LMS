import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { initializeDatabase } from './database';
import { logger } from './logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import assignmentRoutes from './routes/assignments';
import quizRoutes from './routes/quizzes';
import gradeRoutes from './routes/grades';
import discussionRoutes from './routes/discussions';
import adminRoutes from './routes/admin';
import logRoutes from './routes/logs';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/courses`, courseRoutes);
app.use(`${config.apiPrefix}/assignments`, assignmentRoutes);
app.use(`${config.apiPrefix}/quizzes`, quizRoutes);
app.use(`${config.apiPrefix}/grades`, gradeRoutes);
app.use(`${config.apiPrefix}/discussions`, discussionRoutes);
app.use(`${config.apiPrefix}/admin`, adminRoutes);
app.use(`${config.apiPrefix}/logs`, logRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();

    app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📦 Environment: ${config.env}`);
      logger.info(`🔗 API URL: http://localhost:${config.port}${config.apiPrefix}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
