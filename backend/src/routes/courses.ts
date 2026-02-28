import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { logStudentAction } from '../middleware/logger';
import { ActionType, UserRole } from '../types';
import { courseService } from '../services/courseService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * Get user's enrolled courses
 */
router.get(
  '/me',
  logStudentAction(ActionType.COURSE_VIEW),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.moodleUserId) {
        throw new AppError('Moodle user ID not found', 400);
      }

      const courses = await courseService.getUserCourses(req.user.moodleUserId);

      res.json({
        success: true,
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get all courses (for teachers/admins)
 */
router.get('/all', async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role === UserRole.STUDENT) {
      throw new AppError('Insufficient permissions', 403);
    }

    const courses = await courseService.getAllCourses();

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get course details by ID
 */
router.get('/:courseId', async (req: AuthRequest, res, next) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const course = await courseService.getCourseById(courseId);

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get course content (sections and activities)
 */
router.get(
  '/:courseId/content',
  logStudentAction(ActionType.COURSE_VIEW),
  async (req: AuthRequest, res, next) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const content = await courseService.getCourseContent(courseId);

      res.json({
        success: true,
        data: content,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get enrolled users in a course (teacher/admin only)
 */
router.get('/:courseId/users', async (req: AuthRequest, res, next) => {
  try {
    if (req.user?.role === UserRole.STUDENT) {
      throw new AppError('Insufficient permissions', 403);
    }

    const courseId = parseInt(req.params.courseId);
    const users = await courseService.getEnrolledUsers(courseId);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get course categories
 */
router.get('/categories/all', async (_req: AuthRequest, res, next) => {
  try {
    const categories = await courseService.getCourseCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
