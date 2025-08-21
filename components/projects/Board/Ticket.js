"use client";

import { Draggable } from "react-beautiful-dnd";
import Avatar from "@/components/ui/Avatar";
import { getPriorityIcon, getTypeIcon } from "@/lib/utils";

export default function Ticket({
  ticket,
  index,
  onClick,
  setIsModalOpen,
  projectKey,
}) {
  const PriorityIcon = getPriorityIcon(ticket.priority);
  const TypeIcon = getTypeIcon(ticket.type);

  return (
    <Draggable draggableId={ticket.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          // onClick={onClick}
          onClick={() => {
            onClick();
            setIsModalOpen(true);
          }}
          className="bg-white rounded-md shadow p-3 cursor-pointer hover:shadow-md transition-shadow border-l-4"
          style={{
            borderLeftColor: getStatusColor(ticket.status),
            ...provided.draggableProps.style,
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-gray-900">
              {projectKey}-{ticket.id}
            </span>
            <div className="flex space-x-1">
              {ticket.storyPoints && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {ticket.storyPoints}
                </span>
              )}
              <PriorityIcon className="h-4 w-4" />
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {ticket.title}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <TypeIcon className="h-4 w-4 text-gray-500" />
              {/* Add other icons as needed */}
            </div>

            {ticket.assignee && (
              <Avatar
                name={ticket.assignee.name}
                src={ticket.assignee.avatarUrl}
                size="sm"
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

function getStatusColor(status) {
  const colors = {
    backlog: "#94a3b8",
    todo: "#60a5fa",
    in_progress: "#f59e0b",
    in_review: "#818cf8",
    done: "#10b981",
  };
  return colors[status] || "#94a3b8";
}
