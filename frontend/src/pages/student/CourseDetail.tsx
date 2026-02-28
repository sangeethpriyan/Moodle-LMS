import AppLayout from '@/components/AppLayout';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, FileText, CheckSquare, MessageSquare, BarChart } from 'lucide-react';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('content');

  // Mock data
  const course = {
    id: Number(courseId),
    name: 'Computer Science 101',
    code: 'CS101',
    instructor: 'Dr. Smith',
    description: 'Introduction to computer science fundamentals',
    progress: 75,
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="h-5 w-5" /> },
    { id: 'quizzes', label: 'Quizzes', icon: <CheckSquare className="h-5 w-5" /> },
    { id: 'discussions', label: 'Discussions', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'grades', label: 'Grades', icon: <BarChart className="h-5 w-5" /> },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">{course.name}</h1>
              <p className="text-secondary-600 mt-1">
                {course.code} • Instructor: {course.instructor}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-sm text-secondary-600 mb-1">Course Progress</p>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-secondary-900">
                    {course.progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="border-b border-secondary-200 mb-6">
            <div className="flex flex-wrap gap-2 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div>{renderTabContent(activeTab)}</div>
        </div>
      </div>
    </AppLayout>
  );
}

function renderTabContent(tab: string) {
  switch (tab) {
    case 'content':
      return <ContentTab />;
    case 'assignments':
      return <AssignmentsTab />;
    case 'quizzes':
      return <QuizzesTab />;
    case 'discussions':
      return <DiscussionsTab />;
    case 'grades':
      return <GradesTab />;
    default:
      return <ContentTab />;
  }
}

function ContentTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-secondary-900">Course Modules</h3>
      <div className="space-y-3">
        <ModuleItem title="Module 1: Introduction" items={5} completed={5} />
        <ModuleItem title="Module 2: Data Types" items={6} completed={4} />
        <ModuleItem title="Module 3: Control Structures" items={7} completed={3} />
        <ModuleItem title="Module 4: Functions" items={6} completed={0} />
      </div>
    </div>
  );
}

function AssignmentsTab() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Assignments</h3>
      <div className="alert alert-info">
        <p>This section would display course assignments fetched from Moodle API.</p>
      </div>
    </div>
  );
}

function QuizzesTab() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quizzes</h3>
      <div className="alert alert-info">
        <p>This section would display course quizzes fetched from Moodle API.</p>
      </div>
    </div>
  );
}

function DiscussionsTab() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Discussions</h3>
      <div className="alert alert-info">
        <p>This section would display course discussions fetched from Moodle API.</p>
      </div>
    </div>
  );
}

function GradesTab() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Your Grades</h3>
      <div className="alert alert-info">
        <p>This section would display your grades fetched from Moodle API.</p>
      </div>
    </div>
  );
}

function ModuleItem({
  title,
  items,
  completed,
}: {
  title: string;
  items: number;
  completed: number;
}) {
  const progress = (completed / items) * 100;

  return (
    <div className="border border-secondary-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-secondary-900">{title}</h4>
        <span className="text-sm text-secondary-600">
          {completed}/{items} items
        </span>
      </div>
      <div className="w-full bg-secondary-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
