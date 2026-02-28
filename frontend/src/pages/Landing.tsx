import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-900">
                Moodle LMS Wrapper
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
            Welcome to Our
            <span className="text-primary-600"> Learning Platform</span>
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Experience seamless online education with our comprehensive learning management system.
            Access courses, assignments, quizzes, and more in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BookOpen className="h-10 w-10" />}
            title="Rich Course Content"
            description="Access a wide variety of courses with comprehensive materials and resources."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10" />}
            title="Interactive Learning"
            description="Engage with instructors and peers through discussions and collaborative tools."
          />
          <FeatureCard
            icon={<Award className="h-10 w-10" />}
            title="Track Progress"
            description="Monitor your learning journey with detailed analytics and grade reports."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10" />}
            title="Flexible Learning"
            description="Learn at your own pace with 24/7 access to course materials."
          />
        </div>
      </div>

      {/* Announcements Section */}
      <div className="bg-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Latest Announcements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnnouncementCard
              date="Feb 28, 2026"
              title="New Course Launch"
              description="Exciting new courses in Data Science and Machine Learning are now available!"
            />
            <AnnouncementCard
              date="Feb 25, 2026"
              title="System Updates"
              description="We've improved the platform performance and added new features."
            />
            <AnnouncementCard
              date="Feb 20, 2026"
              title="Exam Schedule"
              description="Mid-term examination schedule has been published. Check your dashboard."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Moodle LMS Wrapper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card text-center">
      <div className="flex justify-center text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  );
}

function AnnouncementCard({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div className="card">
      <div className="text-sm text-secondary-500 mb-2">{date}</div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  );
}
