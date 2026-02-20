import { 
  UsersIcon, 
  DocumentTextIcon, 
  NewspaperIcon,
  PhotoIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../store/authStore';

const stats = [
  { name: 'Total Users', value: '0', icon: UsersIcon, color: 'bg-blue-500' },
  { name: 'Total Pages', value: '0', icon: DocumentTextIcon, color: 'bg-green-500' },
  { name: 'Blog Posts', value: '0', icon: NewspaperIcon, color: 'bg-purple-500' },
  { name: 'Media Files', value: '0', icon: PhotoIcon, color: 'bg-yellow-500' },
];

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.full_name || user?.email}!
        </h1>
        <p className="mt-2 text-primary-100">
          Here's what's happening with your dashboard today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-transform hover:scale-105"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        0%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <QuickActionCard
              icon={UsersIcon}
              title="Manage Users"
              description="Add, edit, or remove users"
              href="/users"
            />
            <QuickActionCard
              icon={DocumentTextIcon}
              title="Create Page"
              description="Add a new page to your site"
              href="/pages/new"
            />
            <QuickActionCard
              icon={NewspaperIcon}
              title="Write Blog Post"
              description="Publish a new blog article"
              href="/blog/new"
            />
            <QuickActionCard
              icon={PhotoIcon}
              title="Upload Media"
              description="Add images and files"
              href="/media"
            />
            <QuickActionCard
              icon={ChartBarIcon}
              title="View Analytics"
              description="Check your site statistics"
              href="/analytics"
            />
            <QuickActionCard
              icon={ChartBarIcon}
              title="Settings"
              description="Configure your dashboard"
              href="/settings"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, href }) {
  return (
    <a
      href={href}
      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all group"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}
