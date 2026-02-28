import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../database';
import { User } from '../entities/User';
import { AccessRestriction } from '../entities/AccessRestriction';
import { validate } from '../middleware/validate';
import { config } from '../config';
import { UserRole, ActionType } from '../types';
import { AppError } from '../middleware/errorHandler';
import { StudentLog } from '../entities/StudentLog';

const router = Router();

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { email },
        relations: ['accessRestriction'],
      });

      if (!user || !user.isActive) {
        throw new AppError('Invalid credentials', 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate JWT token
      const tokenOptions: jwt.SignOptions = { expiresIn: '7d' };
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          moodleUserId: user.moodleUserId,
        },
        config.jwt.secret,
        tokenOptions
      );

      // Log login action
      const logRepository = AppDataSource.getRepository(StudentLog);
      await logRepository.save({
        userId: user.id,
        actionType: ActionType.LOGIN,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isRestricted: user.requiresPayment,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Register (for development/testing - in production, users might be synced from Moodle)
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role')
      .optional()
      .isIn(Object.values(UserRole))
      .withMessage('Invalid role'),
  ]),
  async (req, res, next) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      
      // Check if user exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = userRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || UserRole.STUDENT,
      });

      await userRepository.save(user);

      // Create access restriction record for students
      if (user.role === UserRole.STUDENT) {
        const restrictionRepository = AppDataSource.getRepository(AccessRestriction);
        const restriction = restrictionRepository.create({
          userId: user.id,
          isRestricted: false, // Initially not restricted
        });
        await restrictionRepository.save(restriction);
      }

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user profile
router.get('/me', async (_req, res, next) => {
  try {
    // This would be protected by auth middleware in the main app
    res.json({
      success: true,
      data: { message: 'Protected route - implement with auth middleware' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
