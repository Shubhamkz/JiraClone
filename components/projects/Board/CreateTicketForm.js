import { useState } from "react";
import { createTicket } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function CreateTicketForm({
  status,
  projectKey,
  onCancel,
  onSuccess,
  projectId,
  onTicketCreated
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("story");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTicket = await createTicket({
        title,
        description,
        type,
        priority,
        status,
        projectId: projectId,
        reporterId: session?.user?.id || null,
      });
      onSuccess(newTicket);
      onTicketCreated();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-3 rounded-md shadow border border-gray-200 mb-3"
    >
      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ticket title"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        >
          <option value="story">Story</option>
          <option value="bug">Bug</option>
          <option value="task">Task</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mb-3"
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title}
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
