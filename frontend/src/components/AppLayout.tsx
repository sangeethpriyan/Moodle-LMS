import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import {
  Home,
  BookOpen,
  FileText,
  CheckSquare,
  MessageSquare,
  BarChart,
  Users,
  DollarSign,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = getNavigationItems(user?.role || UserRole.STUDENT);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-secondary-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-lg font-bold text-secondary-900">LMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-secondary-500 hover:text-secondary-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-secondary-700 hover:bg-secondary-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-secondary-500 hover:text-secondary-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:ml-4"></div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-secondary-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-secondary-500">{user?.role}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function getNavigationItems(role: UserRole) {
  const baseItems = [
    { name: 'Dashboard', href: `/${role.toLowerCase()}/dashboard`, icon: Home },
  ];

  if (role === UserRole.STUDENT) {
    return [
      ...baseItems,
      { name: 'My Courses', href: '/student/courses', icon: BookOpen },
      { name: 'Assignments', href: '/student/assignments', icon: FileText },
      { name: 'Quizzes', href: '/student/quizzes', icon: CheckSquare },
      { name: 'Grades', href: '/student/grades', icon: BarChart },
      { name: 'Discussions', href: '/student/discussions', icon: MessageSquare },
    ];
  }

  if (role === UserRole.TEACHER) {
    return [
      ...baseItems,
      { name: 'Courses', href: '/teacher/courses', icon: BookOpen },
      { name: 'Gradebook', href: '/teacher/gradebook', icon: BarChart },
      { name: 'Discussions', href: '/teacher/discussions', icon: MessageSquare },
    ];
  }

  if (role === UserRole.ADMIN || role === UserRole.SUPERADMIN) {
    return [
      ...baseItems,
      { name: 'User Management', href: '/admin/users', icon: Users },
      { name: 'Payments', href: '/admin/payments', icon: DollarSign },
      { name: 'Student Logs', href: '/admin/logs', icon: FileBarChart },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];
  }

  return baseItems;
}
