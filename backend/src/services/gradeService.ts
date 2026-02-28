import { moodleService } from './moodleService';

export interface Grade {
  id: number;
  itemname: string;
  itemtype: string;
  itemmodule?: string;
  iteminstance?: number;
  itemnumber?: number;
  categoryid?: number;
  gradetype: number;
  grademax: number;
  grademin: number;
  gradepass: number;
  multfactor: number;
  plusfactor: number;
  aggregationcoef: number;
  aggregationcoef2: number;
  scaleid?: number;
  outcomeid?: number;
  gradegrade?: number;
  feedback?: string;
  dategraded?: number;
  percentageformatted?: string;
  lettergrade?: string;
}

export class GradeService {
  /**
   * Get grades for a user in a course
   */
  async getUserGrades(courseId: number, userId: number): Promise<any> {
    try {
      const result = await moodleService.callFunction<any>(
        'gradereport_user_get_grade_items',
        {
          courseid: courseId,
          userid: userId,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch user grades: ${error}`);
    }
  }

  /**
   * Get grades table for a course (teacher view)
   */
  async getCourseGrades(courseId: number): Promise<any> {
    try {
      const result = await moodleService.callFunction<any>(
        'gradereport_user_get_grades_table',
        { courseid: courseId }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to fetch course grades: ${error}`);
    }
  }

  /**
   * Update grades
   */
  async updateGrades(
    source: string,
    courseId: number,
    component: string,
    activityId: number,
    itemnumber: number,
    grades: Array<{ studentid: number; grade: number }>
  ): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'core_grades_update_grades',
        {
          source,
          courseid: courseId,
          component,
          activityid: activityId,
          itemnumber,
          grades,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to update grades: ${error}`);
    }
  }

  /**
   * Get grade items for a course
   */
  async getGradeItems(courseId: number): Promise<any[]> {
    try {
      const result = await moodleService.callFunction<{ gradeitem: any[] }>(
        'core_grades_get_grade_items',
        {
          courseid: courseId,
        }
      );
      return result.gradeitem || [];
    } catch (error) {
      throw new Error(`Failed to fetch grade items: ${error}`);
    }
  }
}

export const gradeService = new GradeService();
