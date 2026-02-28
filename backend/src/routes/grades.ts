import { Router } from 'express';
import { authMiddleware, AuthRequest, teacherOrAdmin } from '../middleware/auth';
import { logStudentAction } from '../middleware/logger';
import { ActionType } from '../types';
import { gradeService } from '../services/gradeService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * Get user's grades for a course
 */
router.get(
  '/course/:courseId/me',
  logStudentAction(ActionType.GRADE_VIEW),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.moodleUserId) {
        throw new AppError('Moodle user ID not found', 400);
      }

      const courseId = parseInt(req.params.courseId);
      const grades = await gradeService.getUserGrades(courseId, req.user.moodleUserId);

      res.json({
        success: true,
        data: grades,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get all grades for a course (teacher only)
 */
router.get(
  '/course/:courseId/all',
  teacherOrAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const grades = await gradeService.getCourseGrades(courseId);

      res.json({
        success: true,
        data: grades,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get grade items for a course (teacher only)
 */
router.get(
  '/course/:courseId/items',
  teacherOrAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const gradeItems = await gradeService.getGradeItems(courseId);

      res.json({
        success: true,
        data: gradeItems,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
