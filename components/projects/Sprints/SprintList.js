import { format, parseISO } from 'date-fns';
import Button from '@/components/ui/Button';

export default function SprintList({ sprints, projectKey, onEdit }) {
  if (sprints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No sprints found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sprints.map((sprint) => (
        <div key={sprint.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {sprint.name} ({projectKey}-{sprint.id})
              </h3>
              <p className="text-sm text-gray-500">
                {format(parseISO(sprint.startDate), 'MMM d')} -{' '}
                {format(parseISO(sprint.endDate), 'MMM d, yyyy')}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(sprint)}
            >
              Edit
            </Button>
          </div>
          {sprint.goal && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {sprint.goal}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}