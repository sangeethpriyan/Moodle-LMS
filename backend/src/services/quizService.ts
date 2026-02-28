import { moodleService } from './moodleService';

export interface MoodleQuiz {
  id: number;
  course: number;
  coursemodule: number;
  name: string;
  intro?: string;
  introformat?: number;
  timeopen?: number;
  timeclose?: number;
  timelimit?: number;
  overduehandling?: string;
  graceperiod?: number;
  preferredbehaviour?: string;
  canredoquestions?: number;
  attempts?: number;
  attemptonlast?: number;
  grademethod?: number;
  decimalpoints?: number;
  questiondecimalpoints?: number;
  reviewattempt?: number;
  reviewcorrectness?: number;
  reviewmarks?: number;
  reviewspecificfeedback?: number;
  reviewgeneralfeedback?: number;
  reviewrightanswer?: number;
  reviewoverallfeedback?: number;
  questionsperpage?: number;
  navmethod?: string;
  shuffleanswers?: number;
  sumgrades?: number;
  grade?: number;
  timecreated?: number;
  timemodified?: number;
  password?: string;
  subnet?: string;
  browsersecurity?: string;
  delay1?: number;
  delay2?: number;
  showuserpicture?: number;
  showblocks?: number;
  completionattemptsexhausted?: number;
  completionpass?: number;
  allowofflineattempts?: number;
}

export interface QuizAttempt {
  id: number;
  quiz: number;
  userid: number;
  attempt: number;
  uniqueid: number;
  layout: string;
  currentpage: number;
  preview: number;
  state: string;
  timestart: number;
  timefinish: number;
  timemodified: number;
  timemodifiedoffline: number;
  timecheckstate: number;
  sumgrades: number;
}

export class QuizService {
  /**
   * Get quizzes for a course
   */
  async getCourseQuizzes(courseId: number): Promise<MoodleQuiz[]> {
    try {
      const result = await moodleService.callFunction<{ quizzes: MoodleQuiz[] }>(
        'mod_quiz_get_quizzes_by_courses',
        { courseids: [courseId] }
      );
      return result.quizzes || [];
    } catch (error) {
      throw new Error(`Failed to fetch course quizzes: ${error}`);
    }
  }

  /**
   * Get quiz details
   */
  async getQuiz(quizId: number): Promise<MoodleQuiz | null> {
    try {
      const result = await moodleService.callFunction<{ quizzes: MoodleQuiz[] }>(
        'mod_quiz_get_quizzes_by_courses',
        { quizids: [quizId] }
      );
      return result.quizzes?.[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch quiz: ${error}`);
    }
  }

  /**
   * Get user attempts for a quiz
   */
  async getUserAttempts(quizId: number, userId: number): Promise<QuizAttempt[]> {
    try {
      const result = await moodleService.callFunction<{ attempts: QuizAttempt[] }>(
        'mod_quiz_get_user_attempts',
        {
          quizid: quizId,
          userid: userId,
        }
      );
      return result.attempts || [];
    } catch (error) {
      throw new Error(`Failed to fetch user attempts: ${error}`);
    }
  }

  /**
   * Get best grade for a user in a quiz
   */
  async getUserBestGrade(quizId: number, userId: number): Promise<any> {
    try {
      const result = await moodleService.callFunction<any>(
        'mod_quiz_get_user_best_grade',
        {
          quizid: quizId,
          userid: userId,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch user best grade: ${error}`);
    }
  }

  /**
   * Start a quiz attempt
   */
  async startAttempt(quizId: number, userId?: number): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_quiz_start_attempt',
        {
          quizid: quizId,
          ...(userId && { forcenew: 1 }),
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to start quiz attempt: ${error}`);
    }
  }

  /**
   * Get attempt data (questions)
   */
  async getAttemptData(attemptId: number, page: number = 0): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_quiz_get_attempt_data',
        {
          attemptid: attemptId,
          page,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch attempt data: ${error}`);
    }
  }

  /**
   * Process attempt (submit answers)
   */
  async processAttempt(attemptId: number, data: any[]): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_quiz_process_attempt',
        {
          attemptid: attemptId,
          data,
          finishattempt: 0,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to process attempt: ${error}`);
    }
  }

  /**
   * Get attempt review (after submission)
   */
  async getAttemptReview(attemptId: number): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_quiz_get_attempt_review',
        { attemptid: attemptId }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch attempt review: ${error}`);
    }
  }

  /**
   * Get combined feedback for a grade
   */
  async getQuizFeedback(quizId: number, grade: number): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_quiz_get_quiz_feedback_for_grade',
        {
          quizid: quizId,
          grade,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch quiz feedback: ${error}`);
    }
  }
}

export const quizService = new QuizService();
