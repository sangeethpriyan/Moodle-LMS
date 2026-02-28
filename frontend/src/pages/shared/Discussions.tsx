import AppLayout from '@/components/AppLayout';
import { useState } from 'react';
import { MessageSquare, Plus, ThumbsUp, MessageCircle, Clock } from 'lucide-react';

export default function DiscussionsPage() {
  const [selectedForum, setSelectedForum] = useState<number | null>(null);

  // Mock data
  const forums = [
    {
      id: 1,
      name: 'General Discussion',
      course: 'CS101',
      threads: 25,
      unread: 5,
    },
    {
      id: 2,
      name: 'Assignment Help',
      course: 'CS201',
      threads: 18,
      unread: 2,
    },
    {
      id: 3,
      name: 'Project Collaboration',
      course: 'WEB301',
      threads: 12,
      unread: 0,
    },
  ];

  const threads = [
    {
      id: 1,
      title: 'Question about recursion',
      author: 'John Doe',
      replies: 5,
      likes: 3,
      lastActivity: '2026-02-28 10:30',
      isUnread: true,
    },
    {
      id: 2,
      title: 'Help with assignment 2',
      author: 'Jane Smith',
      replies: 8,
      likes: 6,
      lastActivity: '2026-02-28 09:15',
      isUnread: true,
    },
    {
      id: 3,
      title: 'Study group for midterm',
      author: 'Bob Johnson',
      replies: 12,
      likes: 10,
      lastActivity: '2026-02-27 16:45',
      isUnread: false,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Discussions</h1>
            <p className="text-secondary-600 mt-1">Participate in course discussions</p>
          </div>
          <button className="btn btn-primary mt-4 sm:mt-0 inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Thread
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forums List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Forums</h3>
              <div className="space-y-2">
                {forums.map((forum) => (
                  <button
                    key={forum.id}
                    onClick={() => setSelectedForum(forum.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedForum === forum.id
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-secondary-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900">{forum.name}</p>
                        <p className="text-sm text-secondary-600">{forum.course}</p>
                      </div>
                      {forum.unread > 0 && (
                        <span className="badge badge-primary text-xs">{forum.unread}</span>
                      )}
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">{forum.threads} threads</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Threads List */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                {selectedForum ? 'Recent Threads' : 'Select a forum'}
              </h3>

              {selectedForum ? (
                <div className="space-y-3">
                  {threads.map((thread) => (
                    <ThreadItem key={thread.id} thread={thread} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                  <p className="text-secondary-600">Select a forum to view threads</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ThreadItem({ thread }: { thread: any }) {
  return (
    <div
      className={`border rounded-lg p-4 hover:border-primary-300 transition-colors ${
        thread.isUnread ? 'border-primary-200 bg-primary-50' : 'border-secondary-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-secondary-900 hover:text-primary-600 cursor-pointer">
            {thread.title}
            {thread.isUnread && (
              <span className="ml-2 inline-block w-2 h-2 bg-primary-600 rounded-full" />
            )}
          </h4>
          <p className="text-sm text-secondary-600 mt-1">Posted by {thread.author}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-3 text-sm text-secondary-600">
        <div className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-1" />
          {thread.replies} replies
        </div>
        <div className="flex items-center">
          <ThumbsUp className="h-4 w-4 mr-1" />
          {thread.likes} likes
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {new Date(thread.lastActivity).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
