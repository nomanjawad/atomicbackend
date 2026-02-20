import { PAGE_STATUS_LABELS, PAGE_STATUS_COLORS } from '../../utils/pageConstants';

export default function PageStatusBadge({ status }) {
  const label = PAGE_STATUS_LABELS[status] || status;
  const color = PAGE_STATUS_COLORS[status] || 'gray';

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}
    >
      {label}
    </span>
  );
}
