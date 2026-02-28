import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { logStudentAction } from '../middleware/logger';
import { ActionType } from '../types';
import { quizService } from '../services/quizService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * Get quizzes for a course
 */
router.get(
  '/course/:courseId',
  logStudentAction(ActionType.QUIZ_VIEW),
  async (req: AuthRequest, res, next) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const quizzes = await quizService.getCourseQuizzes(courseId);

      res.json({
        success: true,
        data: quizzes,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get quiz details
 */
router.get('/:quizId', async (req: AuthRequest, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const quiz = await quizService.getQuiz(quizId);

    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get user attempts for a quiz
 */
router.get('/:quizId/attempts/me', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.moodleUserId) {
      throw new AppError('Moodle user ID not found', 400);
    }

    const quizId = parseInt(req.params.quizId);
    const attempts = await quizService.getUserAttempts(quizId, req.user.moodleUserId);

    res.json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get user's best grade for a quiz
 */
router.get('/:quizId/grade/me', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.moodleUserId) {
      throw new AppError('Moodle user ID not found', 400);
    }

    const quizId = parseInt(req.params.quizId);
    const grade = await quizService.getUserBestGrade(quizId, req.user.moodleUserId);

    res.json({
      success: true,
      data: grade,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Start a quiz attempt
 */
router.post(
  '/:quizId/attempt/start',
  logStudentAction(ActionType.QUIZ_ATTEMPT),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.moodleUserId) {
        throw new AppError('Moodle user ID not found', 400);
      }

      const quizId = parseInt(req.params.quizId);
      const attempt = await quizService.startAttempt(quizId, req.user.moodleUserId);

      res.json({
        success: true,
        data: attempt,
        message: 'Quiz attempt started successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get attempt data (questions)
 */
router.get('/attempt/:attemptId/data', async (req: AuthRequest, res, next) => {
  try {
    const attemptId = parseInt(req.params.attemptId);
    const page = parseInt(req.query.page as string) || 0;
    
    const data = await quizService.getAttemptData(attemptId, page);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Process attempt (submit answers)
 */
router.post(
  '/attempt/:attemptId/process',
  validate([
    body('data').isArray().withMessage('Data must be an array'),
  ]),
  logStudentAction(ActionType.QUIZ_SUBMIT),
  async (req: AuthRequest, res, next) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { data } = req.body;

      const result = await quizService.processAttempt(attemptId, data);

      res.json({
        success: true,
        data: result,
        message: 'Quiz answers submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get attempt review (after submission)
 */
router.get('/attempt/:attemptId/review', async (req: AuthRequest, res, next) => {
  try {
    const attemptId = parseInt(req.params.attemptId);
    const review = await quizService.getAttemptReview(attemptId);

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get quiz feedback for a grade
 */
router.get('/:quizId/feedback', async (req: AuthRequest, res, next) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const grade = parseFloat(req.query.grade as string);

    if (isNaN(grade)) {
      throw new AppError('Valid grade is required', 400);
    }

    const feedback = await quizService.getQuizFeedback(quizId, grade);

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
