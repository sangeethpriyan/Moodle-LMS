import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware, AuthRequest, teacherOrAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { logStudentAction } from '../middleware/logger';
import { ActionType } from '../types';
import { discussionService } from '../services/discussionService';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * Get forums for a course
 */
router.get(
  '/course/:courseId/forums',
  logStudentAction(ActionType.DISCUSSION_VIEW),
  async (req: AuthRequest, res, next) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const forums = await discussionService.getCourseForums(courseId);

      res.json({
        success: true,
        data: forums,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get forum discussions
 */
router.get('/forum/:forumId', async (req: AuthRequest, res, next) => {
  try {
    const forumId = parseInt(req.params.forumId);
    const sortOrder = req.query.sort as string;
    const page = parseInt(req.query.page as string) || 0;

    const discussions = await discussionService.getForumDiscussions(
      forumId,
      sortOrder,
      page
    );

    res.json({
      success: true,
      data: discussions,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get discussion posts
 */
router.get('/discussion/:discussionId/posts', async (req: AuthRequest, res, next) => {
  try {
    const discussionId = parseInt(req.params.discussionId);
    const posts = await discussionService.getDiscussionPosts(discussionId);

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a new discussion
 */
router.post(
  '/forum/:forumId/discussion',
  validate([
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ]),
  logStudentAction(ActionType.DISCUSSION_POST),
  async (req: AuthRequest, res, next) => {
    try {
      const forumId = parseInt(req.params.forumId);
      const { subject, message, groupId } = req.body;

      const result = await discussionService.addDiscussion(
        forumId,
        subject,
        message,
        groupId
      );

      res.json({
        success: true,
        data: result,
        message: 'Discussion created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Reply to a discussion
 */
router.post(
  '/post/:postId/reply',
  validate([
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ]),
  logStudentAction(ActionType.DISCUSSION_POST),
  async (req: AuthRequest, res, next) => {
    try {
      const postId = parseInt(req.params.postId);
      const { subject, message } = req.body;

      const result = await discussionService.addPost(postId, subject, message);

      res.json({
        success: true,
        data: result,
        message: 'Reply posted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Update a post
 */
router.put(
  '/post/:postId',
  teacherOrAdmin,
  validate([
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const postId = parseInt(req.params.postId);
      const { subject, message } = req.body;

      const result = await discussionService.updatePost(postId, subject, message);

      res.json({
        success: true,
        data: result,
        message: 'Post updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Delete a post (teacher/admin only)
 */
router.delete(
  '/post/:postId',
  teacherOrAdmin,
  async (req: AuthRequest, res, next) => {
    try {
      const postId = parseInt(req.params.postId);
      const result = await discussionService.deletePost(postId);

      res.json({
        success: true,
        data: result,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Lock/unlock a discussion (teacher/admin only)
 */
router.post(
  '/discussion/:discussionId/lock',
  teacherOrAdmin,
  validate([
    body('lock').isBoolean().withMessage('Lock status is required'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const discussionId = parseInt(req.params.discussionId);
      const { lock } = req.body;

      const result = await discussionService.toggleLockDiscussion(discussionId, lock);

      res.json({
        success: true,
        data: result,
        message: `Discussion ${lock ? 'locked' : 'unlocked'} successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Pin/unpin a discussion (teacher/admin only)
 */
router.post(
  '/discussion/:discussionId/pin',
  teacherOrAdmin,
  validate([
    body('pin').isBoolean().withMessage('Pin status is required'),
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const discussionId = parseInt(req.params.discussionId);
      const { pin } = req.body;

      const result = await discussionService.togglePinDiscussion(discussionId, pin);

      res.json({
        success: true,
        data: result,
        message: `Discussion ${pin ? 'pinned' : 'unpinned'} successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
