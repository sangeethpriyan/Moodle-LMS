import { moodleService } from './moodleService';

export interface MoodleUser {
  id: number;
  username?: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  department?: string;
  institution?: string;
  idnumber?: string;
  phone1?: string;
  phone2?: string;
  address?: string;
  firstaccess?: number;
  lastaccess?: number;
  auth?: string;
  suspended?: boolean;
  confirmed?: boolean;
  lang?: string;
  theme?: string;
  timezone?: string;
  mailformat?: number;
  description?: string;
  descriptionformat?: number;
  city?: string;
  country?: string;
  profileimageurlsmall?: string;
  profileimageurl?: string;
}

export class UserService {
  /**
   * Get users by field (e.g., email, id, username)
   */
  async getUsersByField(field: string, values: string[]): Promise<MoodleUser[]> {
    try {
      const result = await moodleService.callFunction<MoodleUser[]>(
        'core_user_get_users_by_field',
        {
          field,
          values,
        }
      );
      return result || [];
    } catch (error) {
      throw new Error(`Failed to fetch users by field: ${error}`);
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<MoodleUser | null> {
    try {
      const users = await this.getUsersByField('email', [email]);
      return users[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch user by email: ${error}`);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<MoodleUser | null> {
    try {
      const users = await this.getUsersByField('id', [userId.toString()]);
      return users[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch user by ID: ${error}`);
    }
  }

  /**
   * Get users (with optional criteria)
   */
  async getUsers(criteria?: any[]): Promise<any> {
    try {
      const result = await moodleService.callFunction<any>(
        'core_user_get_users',
        {
          criteria: criteria || [],
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  /**
   * Create a user
   */
  async createUser(user: Partial<MoodleUser> & { password: string; username: string }): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'core_user_create_users',
        {
          users: [user],
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  /**
   * Update users
   */
  async updateUsers(users: Partial<MoodleUser>[]): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'core_user_update_users',
        { users }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to update users: ${error}`);
    }
  }

  /**
   * Delete users
   */
  async deleteUsers(userIds: number[]): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'core_user_delete_users',
        { userids: userIds }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to delete users: ${error}`);
    }
  }

  /**
   * Get course participants
   */
  async getCourseParticipants(courseId: number): Promise<MoodleUser[]> {
    try {
      const result = await moodleService.callFunction<MoodleUser[]>(
        'core_enrol_get_enrolled_users',
        { courseid: courseId }
      );
      return result || [];
    } catch (error) {
      throw new Error(`Failed to fetch course participants: ${error}`);
    }
  }
}

export const userService = new UserService();
