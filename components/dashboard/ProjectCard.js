import Link from "next/link";
import { FaTasks, FaUsers, FaCalendarAlt } from "react-icons/fa";

export default function ProjectCard({ project }) {
  // Mock data - in a real app, you'd fetch these from your API
  const ticketCount = project._count?.tickets || 0;
  const membersCount = project.members.length || 0;
  const activeSprint = "Sprint 12";

  return (
    <Link
      href={`/projects/${project.id}/board`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {project.key} • {project.description}
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Active
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <FaTasks className="mr-2 text-gray-400" />
            <span>{ticketCount} tickets</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaUsers className="mr-2 text-gray-400" />
            <span>{membersCount} members</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            <span>{activeSprint}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="flex -space-x-2 overflow-hidden">
              {project.members.map((member, index) => {
                const avatarUrl = member.user.avatar_url;
                const initials = member.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                // Random color but consistent for the same user
                const colors = [
                  "bg-red-500",
                  "bg-green-500",
                  "bg-blue-500",
                  "bg-yellow-500",
                  "bg-purple-500",
                  "bg-pink-500",
                ];
                const colorClass = colors[member.user.id % colors.length];

                return avatarUrl ? (
                  <img
                    key={index}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src={avatarUrl}
                    alt={member.user.name}
                  />
                ) : (
                  <div
                    key={index}
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white text-xs font-medium text-white ${colorClass}`}
                  >
                    {initials}
                  </div>
                );
              })}
            </div>

            <span className="ml-2 text-sm text-gray-500">
              +{membersCount - 3} others
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
