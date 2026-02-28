import AppLayout from '@/components/AppLayout';
import { BarChart, TrendingUp, Award } from 'lucide-react';

export default function GradesPage() {
  // Mock data
  const summary = {
    overallAverage: 85.5,
    totalCourses: 5,
    highestGrade: 95,
    lowestGrade: 72,
  };

  const courses = [
    {
      id: 1,
      name: 'Computer Science 101',
      code: 'CS101',
      average: 88,
      assignments: [
        { name: 'Assignment 1', grade: 90, maxGrade: 100 },
        { name: 'Assignment 2', grade: 85, maxGrade: 100 },
        { name: 'Midterm Exam', grade: 88, maxGrade: 100 },
      ],
    },
    {
      id: 2,
      name: 'Data Structures',
      code: 'CS201',
      average: 92,
      assignments: [
        { name: 'Project 1', grade: 95, maxGrade: 100 },
        { name: 'Quiz 1', grade: 90, maxGrade: 100 },
        { name: 'Quiz 2', grade: 91, maxGrade: 100 },
      ],
    },
    {
      id: 3,
      name: 'Web Development',
      code: 'WEB301',
      average: 85,
      assignments: [
        { name: 'HTML/CSS Project', grade: 88, maxGrade: 100 },
        { name: 'JavaScript Assignment', grade: 82, maxGrade: 100 },
      ],
    },
    {
      id: 4,
      name: 'Database Management',
      code: 'DB401',
      average: 78,
      assignments: [
        { name: 'SQL Assignment', grade: 75, maxGrade: 100 },
        { name: 'Database Design', grade: 80, maxGrade: 100 },
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Grades</h1>
          <p className="text-secondary-600 mt-1">View your academic performance</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Overall Average</p>
                <p className="text-2xl font-bold text-primary-600">{summary.overallAverage}%</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <BarChart className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Total Courses</p>
                <p className="text-2xl font-bold text-secondary-900">{summary.totalCourses}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Highest Grade</p>
                <p className="text-2xl font-bold text-green-600">{summary.highestGrade}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Lowest Grade</p>
                <p className="text-2xl font-bold text-orange-600">{summary.lowestGrade}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Grades */}
        <div className="space-y-4">
          {courses.map((course) => (
            <CourseGradeCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

function CourseGradeCard({ course }: { course: any }) {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-secondary-900">{course.name}</h3>
          <p className="text-sm text-secondary-600">{course.code}</p>
        </div>
        <div className="mt-2 md:mt-0">
          <div className="text-right">
            <p className="text-sm text-secondary-600">Course Average</p>
            <p
              className={`text-2xl font-bold ${
                course.average >= 90
                  ? 'text-green-600'
                  : course.average >= 70
                  ? 'text-primary-600'
                  : 'text-orange-600'
              }`}
            >
              {course.average}%
            </p>
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-secondary-700 uppercase">
                Assignment
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-secondary-700 uppercase">
                Grade
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-secondary-700 uppercase">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {course.assignments.map((assignment: any, index: number) => {
              const percentage = (assignment.grade / assignment.maxGrade) * 100;
              return (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-secondary-900">{assignment.name}</td>
                  <td className="px-4 py-3 text-sm text-right text-secondary-900">
                    {assignment.grade}/{assignment.maxGrade}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span
                      className={`font-medium ${
                        percentage >= 90
                          ? 'text-green-600'
                          : percentage >= 70
                          ? 'text-primary-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
