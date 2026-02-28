import { Router } from 'express';
import { body, query } from 'express-validator';
import { authMiddleware, AuthRequest, adminOnly } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppDataSource } from '../database';
import { User } from '../entities/User';
import { Payment } from '../entities/Payment';
import { AccessRestriction } from '../entities/AccessRestriction';
import { PaymentStatus, UserRole } from '../types';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require admin authentication
router.use(authMiddleware, adminOnly);

/**
 * Get all users with pagination
 */
router.get(
  '/users',
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('role').optional().isIn(Object.values(UserRole)).withMessage('Invalid role'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = req.query.role as UserRole;
      const search = req.query.search as string;

      const userRepository = AppDataSource.getRepository(User);
      const queryBuilder = userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.accessRestriction', 'restriction');

      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      if (search) {
        queryBuilder.andWhere(
          '(user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      const [users, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('user.createdAt', 'DESC')
        .getManyAndCount();

      res.json({
        success: true,
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            isRestricted: user.requiresPayment,
            createdAt: user.createdAt,
          })),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Update user role or status
 */
router.patch(
  '/users/:userId',
  validate([
    body('role').optional().isIn(Object.values(UserRole)).withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const { role, isActive } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (role) user.role = role;
      if (typeof isActive === 'boolean') user.isActive = isActive;

      await userRepository.save(user);

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Toggle payment status for a user
 */
router.post(
  '/payments/toggle/:userId',
  async (req: AuthRequest, res, next) => {
    try {
      const userId = parseInt(req.params.userId);

      const userRepository = AppDataSource.getRepository(User);
      const restrictionRepository = AppDataSource.getRepository(AccessRestriction);

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (user.role !== UserRole.STUDENT) {
        throw new AppError('Payment status only applies to students', 400);
      }

      // Get or create access restriction
      let restriction = await restrictionRepository.findOne({ where: { userId } });
      
      if (!restriction) {
        restriction = restrictionRepository.create({ userId, isRestricted: false });
      }

      // Toggle restriction
      restriction.isRestricted = !restriction.isRestricted;
      restriction.reason = restriction.isRestricted ? 'Payment pending' : undefined;
      restriction.restrictedAt = restriction.isRestricted ? new Date() : undefined;
      restriction.restrictedBy = req.user?.userId;

      await restrictionRepository.save(restriction);

      res.json({
        success: true,
        data: {
          userId,
          isRestricted: restriction.isRestricted,
        },
        message: `User access ${restriction.isRestricted ? 'restricted' : 'granted'}`,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Mark payment as paid
 */
router.post(
  '/payments/mark-paid/:userId',
  validate([
    body('amount').isNumeric().withMessage('Amount is required'),
    body('transactionRef').notEmpty().withMessage('Transaction reference is required'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const userId = parseInt(req.params.userId);
      const { amount, transactionRef, paymentMethod, notes } = req.body;

      const paymentRepository = AppDataSource.getRepository(Payment);
      const restrictionRepository = AppDataSource.getRepository(AccessRestriction);

      // Create payment record
      const payment = paymentRepository.create({
        userId,
        amount,
        status: PaymentStatus.SUCCESS,
        transactionRef,
        paymentMethod,
        notes,
      });

      await paymentRepository.save(payment);

      // Remove access restriction
      const restriction = await restrictionRepository.findOne({ where: { userId } });
      if (restriction) {
        restriction.isRestricted = false;
        restriction.reason = 'Payment received';
        await restrictionRepository.save(restriction);
      }

      res.json({
        success: true,
        data: payment,
        message: 'Payment recorded and access granted',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get payment history for a user
 */
router.get('/payments/user/:userId', async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    const paymentRepository = AppDataSource.getRepository(Payment);
    const payments = await paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all payments with filters
 */
router.get('/payments', async (req: AuthRequest, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as PaymentStatus;

    const paymentRepository = AppDataSource.getRepository(Payment);
    const queryBuilder = paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user');

    if (status) {
      queryBuilder.where('payment.status = :status', { status });
    }

    const [payments, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('payment.createdAt', 'DESC')
      .getManyAndCount();

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
