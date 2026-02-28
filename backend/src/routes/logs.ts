import { Router } from 'express';
import { query } from 'express-validator';
import { authMiddleware, AuthRequest, teacherOrAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { AppDataSource } from '../database';
import { StudentLog } from '../entities/StudentLog';
import { ActionType } from '../types';
import { Parser } from 'json2csv';

const router = Router();

// All routes require teacher or admin authentication
router.use(authMiddleware, teacherOrAdmin);

/**
 * Get student logs with filters and pagination
 */
router.get(
  '/',
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('userId').optional().isInt().withMessage('User ID must be an integer'),
    query('courseId').optional().isInt().withMessage('Course ID must be an integer'),
    query('actionType').optional().isIn(Object.values(ActionType)).withMessage('Invalid action type'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
      const actionType = req.query.actionType as ActionType;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const logRepository = AppDataSource.getRepository(StudentLog);
      const queryBuilder = logRepository.createQueryBuilder('log')
        .leftJoinAndSelect('log.user', 'user');

      // Apply filters
      if (userId) {
        queryBuilder.andWhere('log.userId = :userId', { userId });
      }

      if (courseId) {
        queryBuilder.andWhere('log.courseId = :courseId', { courseId });
      }

      if (actionType) {
        queryBuilder.andWhere('log.actionType = :actionType', { actionType });
      }

      if (startDate && endDate) {
        queryBuilder.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        });
      } else if (startDate) {
        queryBuilder.andWhere('log.createdAt >= :startDate', { startDate: new Date(startDate) });
      } else if (endDate) {
        queryBuilder.andWhere('log.createdAt <= :endDate', { endDate: new Date(endDate) });
      }

      const [logs, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('log.createdAt', 'DESC')
        .getManyAndCount();

      res.json({
        success: true,
        data: {
          logs,
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
 * Export logs to CSV
 */
router.get('/export', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
    const actionType = req.query.actionType as ActionType;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const logRepository = AppDataSource.getRepository(StudentLog);
    const queryBuilder = logRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user');

    // Apply same filters as the list endpoint
    if (userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId });
    }

    if (courseId) {
      queryBuilder.andWhere('log.courseId = :courseId', { courseId });
    }

    if (actionType) {
      queryBuilder.andWhere('log.actionType = :actionType', { actionType });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    } else if (startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', { startDate: new Date(startDate) });
    } else if (endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', { endDate: new Date(endDate) });
    }

    const logs = await queryBuilder
      .orderBy('log.createdAt', 'DESC')
      .getMany();

    // Transform logs for CSV export
    const logsForExport = logs.map(log => ({
      'Log ID': log.id,
      'User ID': log.userId,
      'User Name': log.user ? `${log.user.firstName} ${log.user.lastName}` : 'N/A',
      'User Email': log.user?.email || 'N/A',
      'Action Type': log.actionType,
      'Course ID': log.courseId || 'N/A',
      'Course Name': log.courseName || 'N/A',
      'IP Address': log.ipAddress || 'N/A',
      'User Agent': log.userAgent || 'N/A',
      'Metadata': JSON.stringify(log.metadata || {}),
      'Created At': log.createdAt.toISOString(),
    }));

    // Generate CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(logsForExport);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=student-logs-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

/**
 * Get log statistics
 */
router.get('/stats', async (req: AuthRequest, res, next) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const logRepository = AppDataSource.getRepository(StudentLog);
    const queryBuilder = logRepository.createQueryBuilder('log');

    if (startDate && endDate) {
      queryBuilder.where('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    // Get action type counts
    const actionTypeCounts = await queryBuilder
      .select('log.actionType', 'actionType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.actionType')
      .getRawMany();

    // Get daily activity
    const dailyActivity = await queryBuilder
      .select("DATE(log.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('date')
      .orderBy('date', 'DESC')
      .limit(30)
      .getRawMany();

    res.json({
      success: true,
      data: {
        actionTypeCounts,
        dailyActivity,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
