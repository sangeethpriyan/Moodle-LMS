import AppLayout from '@/components/AppLayout';
import { useState } from 'react';
import { CheckSquare, Play, Clock } from 'lucide-react';

export default function QuizzesPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  // Mock data
  const quizzes = {
    available: [
      {
        id: 1,
        title: 'Midterm Quiz - CS101',
        course: 'CS101',
        questions: 20,
        timeLimit: 60,
        attempts: 0,
        maxAttempts: 2,
        availableUntil: '2026-03-10',
      },
      {
        id: 2,
        title: 'Data Structures Quiz 3',
        course: 'CS201',
        questions: 15,
        timeLimit: 45,
        attempts: 1,
        maxAttempts: 3,
        availableUntil: '2026-03-15',
      },
    ],
    completed: [
      {
        id: 3,
        title: 'Web Development Quiz 1',
        course: 'WEB301',
        questions: 10,
        completedDate: '2026-02-20',
        score: 85,
        maxScore: 100,
        attempts: 1,
      },
      {
        id: 4,
        title: 'Database Fundamentals Quiz',
        course: 'DB401',
        questions: 12,
        completedDate: '2026-02-18',
        score: 92,
        maxScore: 100,
        attempts: 1,
      },
    ],
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Quizzes</h1>
          <p className="text-secondary-600 mt-1">Take quizzes and view your results</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('available')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'available'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Available ({quizzes.available.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Completed ({quizzes.completed.length})
            </button>
          </div>
        </div>

        {/* Quiz List */}
        <div className="space-y-4">
          {activeTab === 'available' &&
            quizzes.available.map((quiz) => <AvailableQuizCard key={quiz.id} quiz={quiz} />)}
          {activeTab === 'completed' &&
            quizzes.completed.map((quiz) => <CompletedQuizCard key={quiz.id} quiz={quiz} />)}
        </div>
      </div>
    </AppLayout>
  );
}

function AvailableQuizCard({ quiz }: { quiz: any }) {
  const attemptsRemaining = quiz.maxAttempts - quiz.attempts;

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-900">{quiz.title}</h3>
              <p className="text-sm text-secondary-600 mt-1">Course: {quiz.course}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center text-sm text-secondary-600">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  {quiz.questions} questions
                </div>
                <div className="flex items-center text-sm text-secondary-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {quiz.timeLimit} minutes
                </div>
                <div className="text-sm text-secondary-600">
                  Attempts: {quiz.attempts}/{quiz.maxAttempts}
                </div>
                <div className="text-sm text-secondary-600">
                  Available until: {new Date(quiz.availableUntil).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-6">
          {attemptsRemaining > 0 ? (
            <button className="btn btn-primary inline-flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </button>
          ) : (
            <div className="text-sm text-red-600 font-medium">No attempts remaining</div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompletedQuizCard({ quiz }: { quiz: any }) {
  const percentage = (quiz.score / quiz.maxScore) * 100;

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-900">{quiz.title}</h3>
              <p className="text-sm text-secondary-600 mt-1">Course: {quiz.course}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center text-sm text-secondary-600">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  {quiz.questions} questions
                </div>
                <div className="text-sm text-secondary-600">
                  Completed: {new Date(quiz.completedDate).toLocaleDateString()}
                </div>
                <span className="badge badge-success">Attempt {quiz.attempts}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
          <div className="text-2xl font-bold text-secondary-900">
            {quiz.score}/{quiz.maxScore}
          </div>
          <div
            className={`text-sm font-medium ${
              percentage >= 90
                ? 'text-green-600'
                : percentage >= 70
                ? 'text-blue-600'
                : 'text-orange-600'
            }`}
          >
            {percentage.toFixed(0)}%
          </div>
          <button className="btn btn-secondary mt-2 text-sm">View Results</button>
        </div>
      </div>
    </div>
  );
}
