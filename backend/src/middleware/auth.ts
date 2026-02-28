import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JWTPayload, UserRole } from '../types';
import { AppDataSource } from '../database';
import { User } from '../entities/User';

export interface AuthRequest extends Request {
  user?: JWTPayload & { dbUser?: User };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided',
      });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

      // Fetch user from database with relations
      const userRepository = AppDataSource.getRepository(User);
      const dbUser = await userRepository.findOne({
        where: { id: decoded.userId },
        relations: ['accessRestriction'],
      });

      if (!dbUser || !dbUser.isActive) {
        res.status(401).json({
          success: false,
          error: 'User not found or inactive',
        });
        return;
      }

      // Check if user is restricted (payment required)
      if (dbUser.requiresPayment) {
        res.status(403).json({
          success: false,
          error: 'Payment required. Please contact administration.',
        });
        return;
      }

      req.user = { ...decoded, dbUser };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

// Convenience middleware for specific roles
export const studentOnly = roleMiddleware([UserRole.STUDENT]);
export const teacherOnly = roleMiddleware([UserRole.TEACHER]);
export const adminOnly = roleMiddleware([UserRole.ADMIN, UserRole.SUPERADMIN]);
export const superAdminOnly = roleMiddleware([UserRole.SUPERADMIN]);
export const teacherOrAdmin = roleMiddleware([
  UserRole.TEACHER,
  UserRole.ADMIN,
  UserRole.SUPERADMIN,
]);
