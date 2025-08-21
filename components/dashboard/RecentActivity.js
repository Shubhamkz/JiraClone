import { FaTicketAlt, FaUser, FaCheckCircle, FaPlus, FaCodeBranch } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export default function RecentActivity({ activities }) {
  // Activity icon mapping
  const activityIcons = {
    'created ticket': <FaTicketAlt className="text-blue-500" />,
    'assigned ticket': <FaUser className="text-green-500" />,
    'completed ticket': <FaCheckCircle className="text-purple-500" />,
    'created sprint': <FaPlus className="text-yellow-500" />,
    'merged branch': <FaCodeBranch className="text-red-500" />,
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="flex-shrink-0 mt-1 mr-3">
                {activityIcons[activity.action.split(' ').slice(0, 2).join(' ')] || 
                 <FaTicketAlt className="text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 mr-2">
                    {activity.project}
                  </span>
                  {/* <span>{activity?.time ? formatDistanceToNow(new Date(activity?.time), { addSuffix: true }) : ""}</span> */}
                  <span>{""}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  );
}