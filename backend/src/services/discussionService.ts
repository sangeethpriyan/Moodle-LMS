import { moodleService } from './moodleService';

export interface ForumPost {
  id: number;
  discussion: number;
  parent: number;
  userid: number;
  created: number;
  modified: number;
  mailed: number;
  subject: string;
  message: string;
  messageformat: number;
  messagetrust: number;
  attachment?: string;
  totalscore: number;
  mailnow: number;
  userfullname?: string;
  usermodified?: number;
  userpictureurl?: string;
  capabilities?: any;
}

export interface ForumDiscussion {
  id: number;
  name: string;
  groupid: number;
  timemodified: number;
  usermodified: number;
  timestart: number;
  timeend: number;
  discussion: number;
  parent: number;
  userid: number;
  created: number;
  modified: number;
  mailed: number;
  subject: string;
  message: string;
  messageformat: number;
  messagetrust: number;
  attachment: string;
  totalscore: number;
  mailnow: number;
  userfullname?: string;
  userpictureurl?: string;
  numreplies?: number;
  numunread?: number;
  pinned?: boolean;
  locked?: boolean;
}

export class DiscussionService {
  /**
   * Get forums in a course
   */
  async getCourseForums(courseId: number): Promise<any[]> {
    try {
      const result = await moodleService.callFunction<any[]>(
        'mod_forum_get_forums_by_courses',
        { courseids: [courseId] }
      );
      return result || [];
    } catch (error) {
      throw new Error(`Failed to fetch course forums: ${error}`);
    }
  }

  /**
   * Get forum discussions
   */
  async getForumDiscussions(forumId: number, sortOrder?: string, page?: number): Promise<any> {
    try {
      const result = await moodleService.callFunction<any>(
        'mod_forum_get_forum_discussions',
        {
          forumid: forumId,
          sortorder: sortOrder || 'timemodified',
          page: page || 0,
          perpage: 20,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch forum discussions: ${error}`);
    }
  }

  /**
   * Get discussion posts
   */
  async getDiscussionPosts(discussionId: number): Promise<any> {
    try {
      const result = await moodleService.callFunction<any>(
        'mod_forum_get_discussion_posts',
        {
          discussionid: discussionId,
          sortorder: 'created',
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch discussion posts: ${error}`);
    }
  }

  /**
   * Add a new discussion
   */
  async addDiscussion(
    forumId: number,
    subject: string,
    message: string,
    groupId?: number,
    options?: any[]
  ): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_forum_add_discussion',
        {
          forumid: forumId,
          subject,
          message,
          groupid: groupId || -1,
          options: options || [],
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to add discussion: ${error}`);
    }
  }

  /**
   * Add a post to a discussion
   */
  async addPost(
    postId: number,
    subject: string,
    message: string,
    options?: any[]
  ): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_forum_add_discussion_post',
        {
          postid: postId,
          subject,
          message,
          options: options || [],
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to add post: ${error}`);
    }
  }

  /**
   * Delete a post (teacher/admin only)
   */
  async deletePost(postId: number): Promise<any> {
    try {
      // Note: This function might not be available in all Moodle versions
      // or might require additional permissions/plugins
      const result = await moodleService.callFunction(
        'mod_forum_delete_post',
        { postid: postId }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to delete post: ${error}`);
    }
  }

  /**
   * Update/edit a post
   */
  async updatePost(postId: number, subject: string, message: string): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_forum_update_discussion_post',
        {
          postid: postId,
          subject,
          message,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to update post: ${error}`);
    }
  }

  /**
   * Lock/unlock a discussion (teacher/admin only)
   */
  async toggleLockDiscussion(discussionId: number, lock: boolean): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_forum_set_lock_state',
        {
          forumid: discussionId,
          discussionids: [discussionId],
          targetstate: lock ? 1 : 0,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to toggle discussion lock: ${error}`);
    }
  }

  /**
   * Pin/unpin a discussion
   */
  async togglePinDiscussion(discussionId: number, pin: boolean): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_forum_set_pin_state',
        {
          discussionid: discussionId,
          targetstate: pin ? 1 : 0,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to toggle discussion pin: ${error}`);
    }
  }
}

export const discussionService = new DiscussionService();
