"use client";

import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/ui/Avatar";

export default function ActivityFeed({ activities }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 mr-3">
            <Avatar
              name={activity.user?.name ?? "Unknown User"}
              src={activity.user?.avatar_url ?? undefined}
              size="sm"
            />
          </div>

          {/* Activity details */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.user?.name ?? "Unknown User"}
            </p>
            <p className="text-sm text-gray-600">
              {activity.message}{" "}
              {activity.project && (
                <span className="font-medium">{activity.project.name}</span>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(activity.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
