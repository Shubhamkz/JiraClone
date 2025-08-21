import Avatar from '@/components/ui/Avatar';
import { format } from 'date-fns';

export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        No comments yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Avatar 
              name={comment.user.name} 
              src={comment.user.avatarUrl} 
              size="sm" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {comment.user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-700">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}