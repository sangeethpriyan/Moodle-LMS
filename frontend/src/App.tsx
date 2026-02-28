import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './components/RequireAuth';
import { UserRole } from './types';

// Layouts
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

// Dashboards
import StudentDashboard from './pages/dashboards/Student';
import TeacherDashboard from './pages/dashboards/Teacher';
import AdminDashboard from './pages/dashboards/Admin';

// Student pages
import CoursesPage from './pages/student/Courses';
import CourseDetailPage from './pages/student/CourseDetail';
import AssignmentsPage from './pages/student/Assignments';
import QuizzesPage from './pages/student/Quizzes';
import GradesPage from './pages/student/Grades';

// Admin pages
import UserManagementPage from './pages/admin/UserManagement';
import LogsPage from './pages/admin/Logs';

// Shared pages
import DiscussionsPage from './pages/shared/Discussions';
import NotFoundPage from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Role-based dashboard redirect */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardRedirect />
          </RequireAuth>
        }
      />

      {/* Student routes */}
      <Route
        path="/student/*"
        element={
          <RequireAuth allowedRoles={[UserRole.STUDENT]}>
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId" element={<CourseDetailPage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="quizzes" element={<QuizzesPage />} />
              <Route path="grades" element={<GradesPage />} />
              <Route path="discussions" element={<DiscussionsPage />} />
            </Routes>
          </RequireAuth>
        }
      />

      {/* Teacher routes */}
      <Route
        path="/teacher/*"
        element={
          <RequireAuth allowedRoles={[UserRole.TEACHER]}>
            <Routes>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId" element={<CourseDetailPage />} />
              <Route path="discussions" element={<DiscussionsPage />} />
            </Routes>
          </RequireAuth>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <RequireAuth allowedRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="logs" element={<LogsPage />} />
            </Routes>
          </RequireAuth>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Helper component to redirect to role-specific dashboard
function DashboardRedirect() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  switch (user.role) {
    case UserRole.STUDENT:
      return <Navigate to="/student/dashboard" replace />;
    case UserRole.TEACHER:
      return <Navigate to="/teacher/dashboard" replace />;
    case UserRole.ADMIN:
    case UserRole.SUPERADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default App;
