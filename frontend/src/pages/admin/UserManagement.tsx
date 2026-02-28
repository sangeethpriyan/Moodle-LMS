import AppLayout from '@/components/AppLayout';
import { useState } from 'react';
import { Search, Filter, UserPlus, Edit2, Ban, CheckCircle } from 'lucide-react';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'STUDENT', isActive: true, isRestricted: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'STUDENT', isActive: true, isRestricted: true },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'TEACHER', isActive: true, isRestricted: false },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'STUDENT', isActive: false, isRestricted: false },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">User Management</h1>
            <p className="text-secondary-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <button className="btn btn-primary mt-4 sm:mt-0 inline-flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add User
          </button>
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
                placeholder="Search users..."
                className="input pl-10 w-full"
              />
            </div>
            <button className="btn btn-outline inline-flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">{user.name}</div>
                          <div className="text-sm text-secondary-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        user.role === 'STUDENT' ? 'badge-primary' :
                        user.role === 'TEACHER' ? 'badge-success' :
                        'badge-warning'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'STUDENT' && (
                        <span className={`badge ${user.isRestricted ? 'badge-danger' : 'badge-success'}`}>
                          {user.isRestricted ? 'Restricted' : 'Paid'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {user.role === 'STUDENT' && (
                          <button className="text-orange-600 hover:text-orange-900">
                            {user.isRestricted ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
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
            <span className="font-medium">4</span> results
          </p>
          <div className="flex space-x-2">
            <button className="btn btn-secondary" disabled>
              Previous
            </button>
            <button className="btn btn-secondary" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
