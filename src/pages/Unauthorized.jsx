import { Link } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <ShieldExclamationIcon className="mx-auto h-20 w-20 text-red-500" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
