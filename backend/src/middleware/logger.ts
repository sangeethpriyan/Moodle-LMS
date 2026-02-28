import { Response, NextFunction } from 'express';
import { AppDataSource } from '../database';
import { StudentLog } from '../entities/StudentLog';
import { ActionType } from '../types';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../logger';

export const logStudentAction = (actionType: ActionType) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        return next();
      }

      const logRepository = AppDataSource.getRepository(StudentLog);
      
      const log = logRepository.create({
        userId: req.user.userId,
        actionType,
        metadata: {
          endpoint: req.originalUrl,
          method: req.method,
          params: req.params,
          query: req.query,
        },
        courseId: req.params.courseId ? parseInt(req.params.courseId) : undefined,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      await logRepository.save(log);
      
      next();
    } catch (error) {
      logger.error('Failed to log student action:', error);
      // Don't block the request if logging fails
      next();
    }
  };
};
