'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  BugAntIcon,
  BookmarkSquareIcon,
  CheckCircleIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { DropdownItem, DropdownSubMenu, Dropdown } from '@/components/ui/Dropdown';


export default function BacklogItem({ ticket, projectId, availableSprints }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPriorityIcon = () => {
    switch (ticket.priority) {
      case 'high':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ArrowUpIcon className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case 'critical':
        return <ArrowUpIcon className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeIcon = () => {
    switch (ticket.type) {
      case 'bug':
        return <BugAntIcon className="h-4 w-4 text-red-500" />;
      case 'story':
        return <BookmarkSquareIcon className="h-4 w-4 text-blue-500" />;
      case 'task':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'epic':
        return <BookmarkSquareIcon className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const handleAddToSprint = async (sprintId) => {
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sprintId: sprintId === 'backlog' ? null : sprintId,
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      try {
        const response = await fetch(`/api/tickets/${ticket.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50">
      <div className="col-span-1 flex justify-center">
        <span title={ticket.type} className="flex items-center justify-center">
          {getTypeIcon()}
        </span>
      </div>
      
      <div className="col-span-5">
        <a 
          href={`/projects/${projectId}/tickets/${ticket.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {ticket.title}
        </a>
      </div>
      
      <div className="col-span-2 flex items-center">
        {ticket.assignee ? (
          <div className="flex items-center">
            <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">{ticket.assignee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}
      </div>
      
      <div className="col-span-1 flex justify-center">
        {getPriorityIcon()}
      </div>
      
      <div className="col-span-1 text-center text-sm text-gray-600">
        {ticket.storyPoints || '-'}
      </div>
      
      <div className="col-span-2 flex justify-end">
        <Dropdown
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          trigger={
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-gray-600"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          }
        >
          <div className="py-1">
            <DropdownItem onClick={() => setIsEditing(true)}>
              Edit
            </DropdownItem>
            <DropdownSubMenu title="Add to Sprint">
              <DropdownItem onClick={() => handleAddToSprint('backlog')}>
                Backlog
              </DropdownItem>
              {availableSprints.map((sprint) => (
                <DropdownItem
                  key={sprint.id}
                  onClick={() => handleAddToSprint(sprint.id)}
                >
                  {sprint.name}
                </DropdownItem>
              ))}
            </DropdownSubMenu>
            <DropdownItem onClick={handleDelete} className="text-red-600">
              Delete
            </DropdownItem>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}