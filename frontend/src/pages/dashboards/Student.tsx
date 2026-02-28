import AppLayout from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, FileText, CheckSquare, BarChart, Clock, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  // This would come from API calls in a real app
  const stats = {
    enrolledCourses: 5,
    pendingAssignments: 3,
    upcomingQuizzes: 2,
    averageGrade: 85,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-secondary-600 mt-1">Here's what's happening with your learning</p>
        </div>

        {/* Payment restriction banner */}
        {user?.isRestricted && (
          <div className="alert alert-warning flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Payment Required:</strong> Your access is limited. Please contact  administration to resolve payment issues.
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Enrolled Courses"
            value={stats.enrolledCourses}
            color="blue"
          />
          <StatCard
            icon={<FileText className="h-6 w-6" />}
            title="Pending Assignments"
            value={stats.pendingAssignments}
            color="orange"
          />
          <StatCard
            icon={<CheckSquare className="h-6 w-6" />}
            title="Upcoming Quizzes"
            value={stats.upcomingQuizzes}
            color="purple"
          />
          <StatCard
            icon={<BarChart className="h-6 w-6" />}
            title="Average Grade"
            value={`${stats.averageGrade}%`}
            color="green"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Assignments */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Upcoming Assignments
            </h2>
            <div className="space-y-3">
              <AssignmentItem
                title="Data Structures Final Project"
                course="Computer Science 101"
                dueDate="2026-03-05"
              />
              <AssignmentItem
                title="Essay on Climate Change"
                course="Environmental Science"
                dueDate="2026-03-08"
              />
              <AssignmentItem
                title="Math Problem Set 5"
                course="Calculus II"
                dueDate="2026-03-10"
              />
            </div>
          </div>

          {/* Recent Grades */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recent Grades</h2>
            <div className="space-y-3">
              <GradeItem title="Midterm Exam" course="Physics 101" grade={92} />
              <GradeItem title="Lab Report 3" course="Chemistry" grade={88} />
              <GradeItem title="Quiz 4" course="History" grade={95} />
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Course Progress</h2>
          <div className="space-y-4">
            <CourseProgress name="Computer Science 101" progress={75} />
            <CourseProgress name="Environmental Science" progress={60} />
            <CourseProgress name="Calculus II" progress={85} />
            <CourseProgress name="Physics 101" progress={70} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="card">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-sm text-secondary-600">{title}</p>
        <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function AssignmentItem({
  title,
  course,
  dueDate,
}: {
  title: string;
  course: string;
  dueDate: string;
}) {
  const date = new Date(dueDate);
  const daysUntil = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex items-start p-3 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors">
      <FileText className="h-5 w-5 text-secondary-400 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-secondary-900 truncate">{title}</p>
        <p className="text-sm text-secondary-600">{course}</p>
      </div>
      <div className="ml-2 text-right flex-shrink-0">
        <span className={`inline-flex items-center text-xs font-medium ${
          daysUntil <= 2 ? 'text-red-600' : 'text-orange-600'
        }`}>
          <Clock className="h-4 w-4 mr-1" />
          {daysUntil}d
        </span>
      </div>
    </div>
  );
}

function GradeItem({ title, course, grade }: { title: string; course: string; grade: number }) {
  return (
    <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
      <div>
        <p className="font-medium text-secondary-900">{title}</p>
        <p className="text-sm text-secondary-600">{course}</p>
      </div>
      <div className={`text-2xl font-bold ${
        grade >= 90 ? 'text-green-600' : grade >= 80 ? 'text-blue-600' : 'text-orange-600'
      }`}>
        {grade}%
      </div>
    </div>
  );
}

function CourseProgress({ name, progress }: { name: string; progress: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-900">{name}</span>
        <span className="text-sm text-secondary-600">{progress}%</span>
      </div>
      <div className="w-full bg-secondary-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
