import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, AuthRequest, teacherOrAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { logStudentAction } from '../middleware/logger';
import { ActionType } from '../types';
import { assignmentService } from '../services/assignmentService';
import { AppError } from '../middleware/errorHandler';
import multer from 'multer';
import path from 'path';
import { config } from '../config';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.upload.uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
});

// All routes require authentication
router.use(authMiddleware);

/**
 * Get assignments for a course
 */
router.get(
  '/course/:courseId',
  logStudentAction(ActionType.ASSIGNMENT_VIEW),
  async (req: AuthRequest, res, next) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const assignments = await assignmentService.getCourseAssignments(courseId);

      res.json({
        success: true,
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get assignment details
 */
router.get('/:assignmentId', async (req: AuthRequest, res, next) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const assignment = await assignmentService.getAssignment(assignmentId);

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get assignment submissions (teacher only)
 */
router.get(
  '/:assignmentId/submissions',
  teacherOrAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const submissions = await assignmentService.getSubmissions(assignmentId);

      res.json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get user's submission for an assignment
 */
router.get('/:assignmentId/submission/me', async (req: AuthRequest, res, next) => {
  try {
    if (!req.user?.moodleUserId) {
      throw new AppError('Moodle user ID not found', 400);
    }

    const assignmentId = parseInt(req.params.assignmentId);
    const submission = await assignmentService.getUserSubmission(
      assignmentId,
      req.user.moodleUserId
    );

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Submit assignment
 */
router.post(
  '/:assignmentId/submit',
  upload.single('file'),
  logStudentAction(ActionType.ASSIGNMENT_SUBMIT),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user?.moodleUserId) {
        throw new AppError('Moodle user ID not found', 400);
      }

      const assignmentId = parseInt(req.params.assignmentId);
      const file = req.file;

      if (!file) {
        throw new AppError('No file uploaded', 400);
      }

      // Prepare submission data
      const submissionData = {
        onlinetext_editor: {
          text: req.body.text || '',
          format: 1,
          itemid: 0,
        },
      };

      const result = await assignmentService.submitAssignment(
        assignmentId,
        req.user.moodleUserId,
        submissionData
      );

      res.json({
        success: true,
        data: result,
        message: 'Assignment submitted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Grade an assignment submission (teacher only)
 */
router.post(
  '/:assignmentId/grade',
  teacherOrAdmin,
  validate([
    body('userId').isInt().withMessage('User ID is required'),
    body('grade').isNumeric().withMessage('Grade must be a number'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const { userId, grade, feedback } = req.body;

      const result = await assignmentService.saveGrade(
        assignmentId,
        userId,
        parseFloat(grade),
        feedback
      );

      res.json({
        success: true,
        data: result,
        message: 'Grade saved successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get assignment grades (teacher only)
 */
router.get(
  '/:assignmentId/grades',
  teacherOrAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const assignmentId = parseInt(req.params.assignmentId);
      const grades = await assignmentService.getGrades(assignmentId);

      res.json({
        success: true,
        data: grades,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
