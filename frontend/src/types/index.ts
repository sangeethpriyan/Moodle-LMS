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

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  moodleUserId?: number;
  isRestricted?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
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

export interface Course {
  id: number;
  shortname: string;
  fullname: string;
  displayname: string;
  enrolledusercount?: number;
  visible: number;
  summary?: string;
  format?: string;
  startdate?: number;
  enddate?: number;
  progress?: number;
}

export interface Assignment {
  id: number;
  course: number;
  name: string;
  duedate: number;
  allowsubmissionsfromdate: number;
  grade: number;
  intro?: string;
  nosubmissions: number;
}

export interface Quiz {
  id: number;
  course: number;
  name: string;
  intro?: string;
  timeopen?: number;
  timeclose?: number;
  timelimit?: number;
  attempts?: number;
  grade?: number;
}

export interface Grade {
  id: number;
  itemname: string;
  gradegrade?: number;
  grademax: number;
  grademin: number;
  percentageformatted?: string;
  lettergrade?: string;
  feedback?: string;
}

export interface Discussion {
  id: number;
  name: string;
  subject: string;
  message: string;
  userfullname?: string;
  timemodified: number;
  numreplies?: number;
  pinned?: boolean;
  locked?: boolean;
}

export interface Payment {
  id: number;
  userId: number;
  amount: number;
  status: PaymentStatus;
  transactionRef?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface StudentLog {
  id: number;
  userId: number;
  actionType: ActionType;
  courseId?: number;
  courseName?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
