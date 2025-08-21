"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { updateTicket } from "@/lib/api";
import { getPriorityIcon, getTypeIcon } from "@/lib/utils";
import Button from "@/components/ui/Button";
import TimeEntryList from "./TimeEntryList";
import TimeEntryForm from "@/components/billing/TimeEntryForm";

export default function TicketModal({
  ticket: initialTicket,
  onClose,
  onUpdate,
  projectKey,
}) {
  const [ticket, setTicket] = useState(initialTicket);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedTicket = await updateTicket(ticket?.id, ticket);
      onUpdate(updatedTicket);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const PriorityIcon = getPriorityIcon(ticket?.priority || "low");

  console.log("TicketModal rendered with ticket:", ticket);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${projectKey}-${ticket?.id}`}
    >
      <div className="space-y-6">
        {!isEditing ? (
          <>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">
                {ticket?.title}
              </h2>
              <div className="flex space-x-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    ticket?.type === "bug"
                      ? "bg-red-100 text-red-800"
                      : ticket?.type === "story"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ticket?.type}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <PriorityIcon className="h-4 w-4 mr-1" />
                  {ticket?.priority}
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700">
                {ticket?.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-500">Status</h3>
                <p className="text-gray-900 capitalize">
                  {ticket?.status.replace("_", " ")}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Assignee</h3>
                <p className="text-gray-900">
                  {ticket?.assignee ? ticket?.assignee.name : "Unassigned"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Reporter</h3>
                <p className="text-gray-900">{ticket?.reporter.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500">Created</h3>
                <p className="text-gray-900">
                  {new Date(ticket?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={ticket?.title}
                onChange={(e) =>
                  setTicket({ ...ticket, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={ticket?.description}
                onChange={(e) =>
                  setTicket({ ...ticket, description: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={ticket?.status}
                  onChange={(e) =>
                    setTicket({ ...ticket, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={ticket?.priority}
                  onChange={(e) =>
                    setTicket({ ...ticket, priority: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </form>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Time Entries</h3>
            <Button size="sm" onClick={() => setShowTimeEntryForm(true)}>
              Add Time
            </Button>
          </div>

          <TimeEntryList />
        </div>

        {false && (
          <TimeEntryForm
          // ticket={ticket}
          // projectId={projectId}
          // user={currentUser}
          // onSuccess={(newEntry) => {
          //   setTimeEntries([...timeEntries, newEntry]);
          //   setShowTimeEntryForm(false);
          // }}
          // onClose={() => setShowTimeEntryForm(false)}
          />
        )}
      </div>
    </Modal>
  );
}
