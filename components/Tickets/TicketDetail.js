'use client';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getPriorityIcon, getTypeIcon } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import StatusDropdown from './StatusDropdown';
import AssigneeDropdown from './AssigneeDropdown';

export default function TicketDetail({ ticket, project }) {
  const router = useRouter();
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const PriorityIcon = getPriorityIcon(currentTicket.priority);
  const TypeIcon = getTypeIcon(currentTicket.type);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTicket = { ...currentTicket, status: newStatus };
      setCurrentTicket(updatedTicket);
      await updateTicketStatus(currentTicket.id, newStatus);
      router.refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
      setCurrentTicket(ticket); // Revert on error
    }
  };

  const handleAssigneeChange = async (assignee) => {
    try {
      const updatedTicket = { ...currentTicket, assignee };
      setCurrentTicket(updatedTicket);
      await updateTicketAssignee(currentTicket.id, assignee?.id || null);
      router.refresh();
    } catch (error) {
      console.error('Failed to update assignee:', error);
      setCurrentTicket(ticket); // Revert on error
    }
  };

  const handleCommentAdded = (newComment) => {
    setCurrentTicket(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
  };

  

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Ticket Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.key}-{currentTicket.id}: {currentTicket.title}
            </h1>
            <div className="flex items-center mt-2 space-x-4">
              <StatusDropdown 
                currentStatus={currentTicket.status} 
                onStatusChange={handleStatusChange} 
              />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <TypeIcon className="h-3 w-3 mr-1" />
                {currentTicket.type}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <PriorityIcon className="h-3 w-3 mr-1" />
                {currentTicket.priority}
              </span>
              {currentTicket.storyPoints && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {currentTicket.storyPoints} SP
                </span>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/projects/${project.id}/board`)}
          >
            Back to Board
          </Button>
        </div>
      </div>

      {/* Ticket Body */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-700">
                {currentTicket.description || 'No description provided.'}
              </p>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comments</h3>
              <CommentList comments={currentTicket.comments || []} />
              <CommentForm 
                ticketId={currentTicket.id} 
                onCommentAdded={handleCommentAdded} 
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Reporter</p>
                  <div className="flex items-center mt-1">
                    <Avatar 
                      name={currentTicket.reporter.name} 
                      src={currentTicket.reporter.avatarUrl} 
                      size="sm" 
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {currentTicket.reporter.name}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Assignee</p>
                  <AssigneeDropdown
                    projectMembers={project.members}
                    currentAssignee={currentTicket.assignee}
                    onAssigneeChange={handleAssigneeChange}
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(currentTicket.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(currentTicket.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>

                {currentTicket.sprint && (
                  <div>
                    <p className="text-xs text-gray-500">Sprint</p>
                    <p className="text-sm font-medium text-gray-900">
                      {currentTicket.sprint.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}