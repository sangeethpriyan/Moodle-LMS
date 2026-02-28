import AppLayout from '@/components/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, Users, FileText, BarChart, Download } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuthStore();

  // Mock data - would come from API
  const stats = {
    coursesTeaching: 4,
    totalStudents: 156,
    pendingGrading: 12,
    averageClassGrade: 82,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, Professor {user?.lastName}!
          </h1>
          <p className="text-secondary-600 mt-1">Manage your courses and student progress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Courses Teaching"
            value={stats.coursesTeaching}
            color="blue"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Total Students"
            value={stats.totalStudents}
            color="green"
          />
          <StatCard
            icon={<FileText className="h-6 w-6" />}
            title="Pending Grading"
            value={stats.pendingGrading}
            color="orange"
          />
          <StatCard
            icon={<BarChart className="h-6 w-6" />}
            title="Avg Class Grade"
            value={`${stats.averageClassGrade}%`}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton title="Manage Courses" icon={<BookOpen />} onClick={() => {}} />
            <ActionButton title="Grade Assignments" icon={<FileText />} onClick={() => {}} />
            <ActionButton title="View Gradebook" icon={<BarChart />} onClick={() => {}} />
            <ActionButton title="Export Logs" icon={<Download />} onClick={() => {}} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Courses */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">My Courses</h2>
            <div className="space-y-3">
              <CourseItem name="Computer Science 101" students={45} pending={3} />
              <CourseItem name="Data Structures" students={38} pending={5} />
              <CourseItem name="Algorithms" students={42} pending={2} />
              <CourseItem name="Web Development" students={31} pending={2} />
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Recent Submissions
            </h2>
            <div className="space-y-3">
              <SubmissionItem
                student="John Doe"
                assignment="Final Project"
                course="CS 101"
                time="2 hours ago"
              />
              <SubmissionItem
                student="Jane Smith"
                assignment="Lab Report 5"
                course="Data Structures"
                time="5 hours ago"
              />
              <SubmissionItem
                student="Mike Johnson"
                assignment="Homework 3"
                course="Algorithms"
                time="1 day ago"
              />
            </div>
          </div>
        </div>

        {/* Class Performance Overview */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            Class Performance Overview
          </h2>
          <div className="space-y-4">
            <PerformanceBar courseName="Computer Science 101" average={85} />
            <PerformanceBar courseName="Data Structures" average={78} />
            <PerformanceBar courseName="Algorithms" average={82} />
            <PerformanceBar courseName="Web Development" average={88} />
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
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
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

function ActionButton({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
    >
      <div className="text-primary-600 mb-2">{icon}</div>
      <span className="text-sm font-medium text-secondary-900">{title}</span>
    </button>
  );
}

function CourseItem({
  name,
  students,
  pending,
}: {
  name: string;
  students: number;
  pending: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
      <div>
        <p className="font-medium text-secondary-900">{name}</p>
        <p className="text-sm text-secondary-600">{students} students</p>
      </div>
      {pending > 0 && (
        <span className="badge badge-warning">{pending} pending</span>
      )}
    </div>
  );
}

function SubmissionItem({
  student,
  assignment,
  course,
  time,
}: {
  student: string;
  assignment: string;
  course: string;
  time: string;
}) {
  return (
    <div className="flex items-start p-3 border border-secondary-200 rounded-lg">
      <FileText className="h-5 w-5 text-secondary-400 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-secondary-900">{student}</p>
        <p className="text-sm text-secondary-600">
          {assignment} • {course}
        </p>
        <p className="text-xs text-secondary-500 mt-1">{time}</p>
      </div>
      <button className="btn btn-secondary btn-sm ml-2">Grade</button>
    </div>
  );
}

function PerformanceBar({ courseName, average }: { courseName: string; average: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-900">{courseName}</span>
        <span className="text-sm text-secondary-600">{average}%</span>
      </div>
      <div className="w-full bg-secondary-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            average >= 85 ? 'bg-green-500' : average >= 70 ? 'bg-blue-500' : 'bg-orange-500'
          }`}
          style={{ width: `${average}%` }}
        />
      </div>
    </div>
  );
}
