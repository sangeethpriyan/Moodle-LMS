import AppLayout from '@/components/AppLayout';
import { Users, DollarSign, FileBarChart, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  // Mock data
  const stats = {
    totalUsers: 1248,
    pendingPayments: 23,
    activeRestrictions: 8,
    totalRevenue: 45670,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">
            Admin Dashboard
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage users, payments, and monitor system activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Pending Payments"
            value={stats.pendingPayments}
            color="orange"
          />
          <StatCard
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Restricted Users"
            value={stats.activeRestrictions}
            color="red"
          />
          <StatCard
            icon={<FileBarChart className="h-6 w-6" />}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionButton title="Manage Users" icon={<Users />} href="/admin/users" />
            <ActionButton title="View Payments" icon={<DollarSign />} href="/admin/payments" />
            <ActionButton title="Student Logs" icon={<FileBarChart />} href="/admin/logs" />
            <ActionButton title="Export Data" icon={<FileBarChart />} onClick={() => {}} />
          </div>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent User Registrations */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Recent Registrations
            </h2>
            <div className="space-y-3">
              <UserItem name="Alice Johnson" email="alice@example.com" role="Student" />
              <UserItem name="Bob Smith" email="bob@example.com" role="Student" />
              <UserItem name="Carol Williams" email="carol@example.com" role="Teacher" />
              <UserItem name="David Brown" email="david@example.com" role="Student" />
            </div>
          </div>

          {/* Payment Status */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Pending Payments
            </h2>
            <div className="space-y-3">
              <PaymentItem name="John Doe" amount={250} dueDate="2026-03-01" />
              <PaymentItem name="Jane Smith" amount={250} dueDate="2026-03-03" />
              <PaymentItem name="Mike Wilson" amount={250} dueDate="2026-03-05" />
              <PaymentItem name="Sarah Davis" amount={250} dueDate="2026-03-07" />
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            System Activity (Last 7 Days)
          </h2>
          <div className="space-y-4">
            <ActivityBar label="Logins" value={3456} max={4000} color="blue" />
            <ActivityBar label="Course Views" value={8920} max={10000} color="green" />
            <ActivityBar label="Assignment Submissions" value={1234} max={2000} color="purple" />
            <ActivityBar label="Quiz Attempts" value={2890} max={3000} color="orange" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="card">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <div className="mt-4">
        <p className="text-sm text-secondary-600">{title}</p>
        <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({
  title,
  icon,
  href,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="text-primary-600 mb-2">{icon}</div>
      <span className="text-sm font-medium text-secondary-900">{title}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex flex-col items-center p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-4 border-2 border-secondary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
    >
      {content}
    </button>
  );
}

function UserItem({ name, email, role }: { name: string; email: string; role: string }) {
  return (
    <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium mr-3">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-medium text-secondary-900">{name}</p>
          <p className="text-sm text-secondary-600">{email}</p>
        </div>
      </div>
      <span className="badge badge-primary">{role}</span>
    </div>
  );
}

function PaymentItem({ name, amount, dueDate }: { name: string; amount: number; dueDate: string }) {
  return (
    <div className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
      <div>
        <p className="font-medium text-secondary-900">{name}</p>
        <p className="text-sm text-secondary-600">Due: {dueDate}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-secondary-900">${amount}</p>
        <button className="text-sm text-primary-600 hover:text-primary-700">Mark Paid</button>
      </div>
    </div>
  );
}

function ActivityBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-900">{label}</span>
        <span className="text-sm text-secondary-600">
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-secondary-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
