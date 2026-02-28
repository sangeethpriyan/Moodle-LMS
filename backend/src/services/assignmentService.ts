import { moodleService } from './moodleService';

export interface MoodleAssignment {
  id: number;
  course: number;
  name: string;
  nosubmissions: number;
  submissiondrafts: number;
  sendnotifications: number;
  sendlatenotifications: number;
  sendstudentnotifications: number;
  duedate: number;
  allowsubmissionsfromdate: number;
  grade: number;
  timemodified: number;
  completionsubmit: number;
  cutoffdate: number;
  gradingduedate: number;
  teamsubmission: number;
  requireallteammemberssubmit: number;
  teamsubmissiongroupingid: number;
  blindmarking: number;
  hidegrader: number;
  revealidentities: number;
  attemptreopenmethod: string;
  maxattempts: number;
  markingworkflow: number;
  markingallocation: number;
  requiresubmissionstatement: number;
  preventsubmissionnotingroup: number;
  intro?: string;
  introformat?: number;
}

export interface AssignmentSubmission {
  assignment: number;
  userid: number;
  timecreated: number;
  timemodified: number;
  status: string;
  groupid: number;
  attemptnumber: number;
  latest: number;
  plugins?: any[];
}

export class AssignmentService {
  /**
   * Get assignments for a course
   */
  async getCourseAssignments(courseId: number): Promise<MoodleAssignment[]> {
    try {
      const result = await moodleService.callFunction<{ courses: any[] }>(
        'mod_assign_get_assignments',
        { courseids: [courseId] }
      );
      
      if (result.courses && result.courses.length > 0) {
        return result.courses[0].assignments || [];
      }
      return [];
    } catch (error) {
      throw new Error(`Failed to fetch course assignments: ${error}`);
    }
  }

  /**
   * Get assignment details
   */
  async getAssignment(assignmentId: number): Promise<MoodleAssignment | null> {
    try {
      const result = await moodleService.callFunction<{ assignments: MoodleAssignment[] }>(
        'mod_assign_get_assignments',
        { assignmentids: [assignmentId] }
      );
      return result.assignments?.[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch assignment: ${error}`);
    }
  }

  /**
   * Get assignment submissions
   */
  async getSubmissions(assignmentId: number): Promise<any[]> {
    try {
      const result = await moodleService.callFunction<any>(
        'mod_assign_get_submissions',
        { assignmentids: [assignmentId] }
      );
      return result.assignments?.[0]?.submissions || [];
    } catch (error) {
      throw new Error(`Failed to fetch submissions: ${error}`);
    }
  }

  /**
   * Get user submission for an assignment
   */
  async getUserSubmission(assignmentId: number, userId: number): Promise<AssignmentSubmission | null> {
    try {
      const result = await moodleService.callFunction<any>(
        'mod_assign_get_submission_status',
        {
          assignid: assignmentId,
          userid: userId,
        }
      );
      return result.lastattempt?.submission || null;
    } catch (error) {
      throw new Error(`Failed to fetch user submission: ${error}`);
    }
  }

  /**
   * Submit assignment (simplified - actual implementation depends on Moodle setup)
   */
  async submitAssignment(
    assignmentId: number,
    _userId: number,
    submissionData: any
  ): Promise<any> {
    try {
      // Note: This is a placeholder. Actual submission requires file upload handling
      // and might use 'mod_assign_save_submission' or similar function
      const result = await moodleService.callFunction(
        'mod_assign_save_submission',
        {
          assignmentid: assignmentId,
          plugindata: submissionData,
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to submit assignment: ${error}`);
    }
  }

  /**
   * Save grade for a submission
   */
  async saveGrade(
    assignmentId: number,
    userId: number,
    grade: number,
    feedback?: string
  ): Promise<any> {
    try {
      const result = await moodleService.callFunction(
        'mod_assign_save_grade',
        {
          assignmentid: assignmentId,
          userid: userId,
          grade,
          attemptnumber: -1, // Latest attempt
          addattempt: 0,
          workflowstate: '',
          applytoall: 0,
          plugindata: {
            assignfeedbackcomments_editor: {
              text: feedback || '',
              format: 1,
            },
          },
        }
      );
      return result;
    } catch (error) {
      throw new Error(`Failed to save grade: ${error}`);
    }
  }

  /**
   * Get grades for an assignment
   */
  async getGrades(assignmentId: number): Promise<any[]> {
    try {
      const result = await moodleService.callFunction<any>(
        'mod_assign_get_grades',
        { assignmentids: [assignmentId] }
      );
      return result.assignments?.[0]?.grades || [];
    } catch (error) {
      throw new Error(`Failed to fetch grades: ${error}`);
    }
  }
}

export const assignmentService = new AssignmentService();
