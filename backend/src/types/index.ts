export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum ActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  COURSE_VIEW = 'COURSE_VIEW',
  COURSE_ENROLL = 'COURSE_ENROLL',
  ASSIGNMENT_VIEW = 'ASSIGNMENT_VIEW',
  ASSIGNMENT_SUBMIT = 'ASSIGNMENT_SUBMIT',
  QUIZ_VIEW = 'QUIZ_VIEW',
  QUIZ_ATTEMPT = 'QUIZ_ATTEMPT',
  QUIZ_SUBMIT = 'QUIZ_SUBMIT',
  DISCUSSION_VIEW = 'DISCUSSION_VIEW',
  DISCUSSION_POST = 'DISCUSSION_POST',
  ATTENDANCE_MARK = 'ATTENDANCE_MARK',
  GRADE_VIEW = 'GRADE_VIEW',
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  moodleUserId?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
