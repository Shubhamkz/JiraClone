'use client';

import { useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import { updateTicketAssignee } from '@/lib/api';

export default function AssigneeDropdown({ projectMembers, currentAssignee, onAssigneeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAssigneeSelect = async (assignee) => {
    setIsOpen(false);
    await onAssigneeChange(assignee);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center mt-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentAssignee ? (
            <>
              <Avatar 
                name={currentAssignee.name} 
                src={currentAssignee.avatarUrl} 
                size="sm" 
              />
              <span className="ml-2 text-sm font-medium text-gray-900">
                {currentAssignee.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Unassigned</span>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => handleAssigneeSelect(null)}
            >
              Unassign
            </button>
            {projectMembers.map((member) => (
              <button
                key={member.id}
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => handleAssigneeSelect(member)}
              >
                <Avatar 
                  name={member.name} 
                  src={member.avatarUrl} 
                  size="sm" 
                />
                <span className="ml-2">{member.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}