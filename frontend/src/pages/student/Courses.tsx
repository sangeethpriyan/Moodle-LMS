import AppLayout from '@/components/AppLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter } from 'lucide-react';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - would come from API
  const courses = [
    {
      id: 1,
      name: 'Computer Science 101',
      code: 'CS101',
      instructor: 'Dr. Smith',
      progress: 75,
      enrolledStudents: 45,
      nextClass: '2026-03-01',
    },
    {
      id: 2,
      name: 'Data Structures',
      code: 'CS201',
      instructor: 'Prof. Johnson',
      progress: 60,
      enrolledStudents: 38,
      nextClass: '2026-03-02',
    },
    {
      id: 3,
      name: 'Web Development',
      code: 'WEB301',
      instructor: 'Dr. Williams',
      progress: 85,
      enrolledStudents: 42,
      nextClass: '2026-03-01',
    },
    {
      id: 4,
      name: 'Database Management',
      code: 'DB401',
      instructor: 'Prof. Brown',
      progress: 70,
      enrolledStudents: 35,
      nextClass: '2026-03-03',
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Courses</h1>
          <p className="text-secondary-600 mt-1">View and manage your enrolled courses</p>
        </div>

        {/* Search and Filter */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="input pl-10 w-full"
              />
            </div>
            <button className="btn btn-outline inline-flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">No courses found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Link to={`/student/courses/${course.id}`} className="card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-secondary-900">{course.name}</h3>
          <p className="text-sm text-secondary-600">{course.code}</p>
        </div>
        <span className="badge badge-primary">{course.progress}%</span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-secondary-600">
          <span className="font-medium mr-2">Instructor:</span>
          {course.instructor}
        </div>
        <div className="flex items-center text-sm text-secondary-600">
          <span className="font-medium mr-2">Next Class:</span>
          {new Date(course.nextClass).toLocaleDateString()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-secondary-600 mb-1">
          <span>Progress</span>
          <span>{course.progress}% Complete</span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      <button className="btn btn-primary w-full">View Course</button>
    </Link>
  );
}
