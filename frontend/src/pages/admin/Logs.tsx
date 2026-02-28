import AppLayout from '@/components/AppLayout';
import { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';

export default function LogsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock data
  const logs = [
    {
      id: 1,
      user: 'John Doe',
      action: 'COURSE_VIEW',
      course: 'CS101',
      timestamp: '2026-02-28 10:15:30',
      ip: '192.168.1.1',
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'ASSIGNMENT_SUBMIT',
      course: 'CS201',
      timestamp: '2026-02-28 09:45:12',
      ip: '192.168.1.2',
    },
    {
      id: 3,
      user: 'Bob Johnson',
      action: 'QUIZ_ATTEMPT',
      course: 'WEB301',
      timestamp: '2026-02-28 08:30:45',
      ip: '192.168.1.3',
    },
    {
      id: 4,
      user: 'Alice Williams',
      action: 'LOGIN',
      course: null,
      timestamp: '2026-02-28 07:20:18',
      ip: '192.168.1.4',
    },
  ];

  const handleExport = () => {
    alert('This would trigger CSV export from /api/logs/export');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Student Activity Logs</h1>
            <p className="text-secondary-600 mt-1">Monitor and export student activity</p>
          </div>
          <button
            onClick={handleExport}
            className="btn btn-primary mt-4 sm:mt-0 inline-flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            <div>
              <label className="label">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>
            <div>
              <label className="label">Action Type</label>
              <select className="input w-full">
                <option value="">All Actions</option>
                <option value="LOGIN">Login</option>
                <option value="COURSE_VIEW">Course View</option>
                <option value="ASSIGNMENT_SUBMIT">Assignment Submit</option>
                <option value="QUIZ_ATTEMPT">Quiz Attempt</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button className="btn btn-secondary">Clear</button>
            <button className="btn btn-primary inline-flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">{log.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-primary">{log.action}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">{log.course || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-600">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-600">{log.ip}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-600">
            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
            <span className="font-medium">156</span> results
          </p>
          <div className="flex space-x-2">
            <button className="btn btn-secondary">Previous</button>
            <button className="btn btn-primary">Next</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
