"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTeamMember, removeTeamMember } from "@/lib/api";
import Avatar from "@/components/ui/Avatar";

export default function TeamMembers({ project, availableUsers }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleAddMember = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    setError(null);

    try {
      await addTeamMember(project.id, selectedUser);
      router.refresh();
      setSelectedUser("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      setIsProcessing(true);
      setError(null);

      try {
        await removeTeamMember(project.id, userId);
        router.refresh();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Filter out users already in the project
  const availableOptions = availableUsers.filter(
    (user) => !project.members?.some((member) => member.id === user.id)
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
          disabled={isProcessing || availableOptions.length === 0}
        >
          <option value="">Select a user to add...</option>
          {availableOptions.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAddMember}
          disabled={!selectedUser || isProcessing}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {project?.members?.map((member) => (
          <div
            key={member.projectId}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
          >
            <div className="flex items-center space-x-3">
              <Avatar
                name={member.user.name}
                src={member.user.avatar_url}
                size="sm"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {member.user.name}
                </div>
                <div className="text-sm text-gray-500">{member.user.email}</div>
              </div>
            </div>
            {member.user.id !== project.userId && (
              <button
                type="button"
                onClick={() => handleRemoveMember(member.user.id)}
                disabled={isProcessing}
                className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
