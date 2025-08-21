'use client';

import { format, parseISO } from 'date-fns';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function SprintOverview({ sprint }) {
  if (!sprint) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Sprint</h2>
        <p className="text-gray-500">No active sprint</p>
      </div>
    );
  }

  const daysRemaining = Math.max(
    0, 
    Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Active Sprint</h2>
        <Link href={`/projects/${sprint.projectId}/sprints`}>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>
      
      <h3 className="text-md font-medium text-gray-800 mb-1">{sprint.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{sprint.goal}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Start Date</p>
          <p className="text-sm font-medium">
            {format(parseISO(sprint.startDate), 'MMM d, yyyy')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">End Date</p>
          <p className="text-sm font-medium">
            {format(parseISO(sprint.endDate), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{Math.round(sprint.progress)}%</span>
        </div>
        <ProgressBar value={sprint.progress} />
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-blue-50 p-2 rounded">
          <p className="font-bold text-blue-600">{sprint.totalTasks}</p>
          <p className="text-gray-600">Total</p>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <p className="font-bold text-green-600">{sprint.completedTasks}</p>
          <p className="text-gray-600">Done</p>
        </div>
        <div className="bg-yellow-50 p-2 rounded">
          <p className="font-bold text-yellow-600">{daysRemaining}</p>
          <p className="text-gray-600">Days Left</p>
        </div>
      </div>
    </div>
  );
}