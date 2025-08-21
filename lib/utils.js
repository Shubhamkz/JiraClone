import {
  BugAntIcon,
  BookmarkSquareIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

export function getPriorityIcon(priority) {
  switch (priority) {
    case 'high':
      return ExclamationTriangleIcon;
    case 'critical':
      return ArrowUpIcon;
    case 'low':
      return ArrowDownIcon;
    default:
      return CheckCircleIcon;
  }
}

export function getTypeIcon(type) {
  switch (type) {
    case 'bug':
      return BugAntIcon;
    case 'story':
      return BookmarkSquareIcon;
    default:
      return BookmarkSquareIcon;
  }
}

export function getStatusColor(status) {
  const colors = {
    backlog: '#94a3b8',
    todo: '#60a5fa',
    in_progress: '#f59e0b',
    in_review: '#818cf8',
    done: '#10b981',
  };
  return colors[status] || '#94a3b8';
}