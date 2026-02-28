import { moodleService } from './moodleService';

export interface MoodleCourse {
  id: number;
  shortname: string;
  fullname: string;
  displayname: string;
  enrolledusercount?: number;
  idnumber?: string;
  visible: number;
  summary?: string;
  summaryformat?: number;
  format?: string;
  showgrades?: boolean;
  lang?: string;
  enablecompletion?: boolean;
  category?: number;
  progress?: number;
  startdate?: number;
  enddate?: number;
}

export interface CourseContent {
  id: number;
  name: string;
  visible: number;
  summary: string;
  summaryformat: number;
  section: number;
  hiddenbynumsections: number;
  uservisible: boolean;
  modules: CourseModule[];
}

export interface CourseModule {
  id: number;
  url?: string;
  name: string;
  instance?: number;
  description?: string;
  visible: number;
  uservisible: boolean;
  visibleoncoursepage: number;
  modicon: string;
  modname: string;
  modplural: string;
  availability?: string;
  indent: number;
  onclick?: string;
  afterlink?: string;
  customdata?: string;
  noviewlink?: boolean;
  completion?: number;
  completiondata?: any;
}

export class CourseService {
  /**
   * Get courses for a user
   */
  async getUserCourses(moodleUserId: number): Promise<MoodleCourse[]> {
    try {
      const courses = await moodleService.callFunction<MoodleCourse[]>(
        'core_enrol_get_users_courses',
        { userid: moodleUserId }
      );
      return courses || [];
    } catch (error) {
      throw new Error(`Failed to fetch user courses: ${error}`);
    }
  }

  /**
   * Get all courses (for teachers/admins)
   */
  async getAllCourses(): Promise<MoodleCourse[]> {
    try {
      const result = await moodleService.callFunction<{ courses: MoodleCourse[] }>(
        'core_course_get_courses'
      );
      return result.courses || [];
    } catch (error) {
      throw new Error(`Failed to fetch all courses: ${error}`);
    }
  }

  /**
   * Get course details by ID
   */
  async getCourseById(courseId: number): Promise<MoodleCourse | null> {
    try {
      const result = await moodleService.callFunction<{ courses: MoodleCourse[] }>(
        'core_course_get_courses',
        { options: { ids: [courseId] } }
      );
      return result.courses?.[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch course: ${error}`);
    }
  }

  /**
   * Get course content (sections and activities)
   */
  async getCourseContent(courseId: number): Promise<CourseContent[]> {
    try {
      const content = await moodleService.callFunction<CourseContent[]>(
        'core_course_get_contents',
        { courseid: courseId }
      );
      return content || [];
    } catch (error) {
      throw new Error(`Failed to fetch course content: ${error}`);
    }
  }

  /**
   * Get enrolled users in a course
   */
  async getEnrolledUsers(courseId: number): Promise<any[]> {
    try {
      const users = await moodleService.callFunction<any[]>(
        'core_enrol_get_enrolled_users',
        { courseid: courseId }
      );
      return users || [];
    } catch (error) {
      throw new Error(`Failed to fetch enrolled users: ${error}`);
    }
  }

  /**
   * Get course categories
   */
  async getCourseCategories(): Promise<any[]> {
    try {
      const categories = await moodleService.callFunction<any[]>(
        'core_course_get_categories'
      );
      return categories || [];
    } catch (error) {
      throw new Error(`Failed to fetch course categories: ${error}`);
    }
  }
}

export const courseService = new CourseService();
