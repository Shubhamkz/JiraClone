'use client';

import { useState } from 'react';
import { updateTicketStatus } from '@/lib/api';

const statusOptions = [
  { value: 'backlog', label: 'Backlog', color: 'bg-gray-200' },
  { value: 'todo', label: 'To Do', color: 'bg-blue-200' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-200' },
  { value: 'in_review', label: 'In Review', color: 'bg-purple-200' },
  { value: 'done', label: 'Done', color: 'bg-green-200' },
];

export default function StatusDropdown({ currentStatus, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentStatusObj = statusOptions.find(opt => opt.value === currentStatus);

  const handleStatusSelect = async (status) => {
    setIsOpen(false);
    if (status !== currentStatus) {
      await onStatusChange(status);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${currentStatusObj?.color} text-gray-800`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentStatusObj?.label || currentStatus}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full text-left px-4 py-2 text-sm ${option.value === currentStatus ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => handleStatusSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}