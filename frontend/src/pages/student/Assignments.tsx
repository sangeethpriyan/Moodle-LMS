import AppLayout from '@/components/AppLayout';
import { useState } from 'react';
import { FileText, Upload, Calendar, AlertCircle } from 'lucide-react';

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // Mock data
  const assignments = {
    pending: [
      {
        id: 1,
        title: 'Programming Assignment 1',
        course: 'CS101',
        dueDate: '2026-03-05',
        points: 100,
        status: 'not_started',
      },
      {
        id: 2,
        title: 'Data Structures Project',
        course: 'CS201',
        dueDate: '2026-03-07',
        points: 150,
        status: 'in_progress',
      },
      {
        id: 3,
        title: 'Web Development Task',
        course: 'WEB301',
        dueDate: '2026-03-10',
        points: 80,
        status: 'not_started',
      },
    ],
    completed: [
      {
        id: 4,
        title: 'Database Design Assignment',
        course: 'DB401',
        submittedDate: '2026-02-20',
        points: 90,
        grade: 85,
        status: 'graded',
      },
      {
        id: 5,
        title: 'Algorithm Analysis',
        course: 'CS201',
        submittedDate: '2026-02-15',
        points: 100,
        grade: 92,
        status: 'graded',
      },
    ],
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Assignments</h1>
          <p className="text-secondary-600 mt-1">View and submit your assignments</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-secondary-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pending'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Pending ({assignments.pending.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900'
              }`}
            >
              Completed ({assignments.completed.length})
            </button>
          </div>
        </div>

        {/* Assignment List */}
        <div className="space-y-4">
          {activeTab === 'pending' &&
            assignments.pending.map((assignment) => (
              <PendingAssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          {activeTab === 'completed' &&
            assignments.completed.map((assignment) => (
              <CompletedAssignmentCard key={assignment.id} assignment={assignment} />
            ))}
        </div>
      </div>
    </AppLayout>
  );
}

function PendingAssignmentCard({ assignment }: { assignment: any }) {
  const daysUntilDue = Math.ceil(
    (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilDue <= 2;

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-900">{assignment.title}</h3>
              <p className="text-sm text-secondary-600 mt-1">Course: {assignment.course}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-secondary-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="text-sm font-medium text-secondary-900">
                  {assignment.points} points
                </div>
                <span
                  className={`badge ${
                    assignment.status === 'in_progress' ? 'badge-warning' : 'badge-secondary'
                  }`}
                >
                  {assignment.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
          {isUrgent && (
            <div className="flex items-center text-red-600 text-sm mb-2 sm:mb-0">
              <AlertCircle className="h-4 w-4 mr-1" />
              Due in {daysUntilDue} days
            </div>
          )}
          <button className="btn btn-primary inline-flex items-center justify-center">
            <Upload className="h-4 w-4 mr-2" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletedAssignmentCard({ assignment }: { assignment: any }) {
  const gradePercentage = (assignment.grade / assignment.points) * 100;

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-900">{assignment.title}</h3>
              <p className="text-sm text-secondary-600 mt-1">Course: {assignment.course}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-secondary-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}
                </div>
                <span className="badge badge-success">Graded</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
          <div className="text-2xl font-bold text-secondary-900">
            {assignment.grade}/{assignment.points}
          </div>
          <div
            className={`text-sm font-medium ${
              gradePercentage >= 90
                ? 'text-green-600'
                : gradePercentage >= 70
                ? 'text-blue-600'
                : 'text-orange-600'
            }`}
          >
            {gradePercentage.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
