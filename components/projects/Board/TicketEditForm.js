export default function TicketEditForm({ ticket, onTicketChange, onSubmit }) {
  const handleChange = (field, value) => {
    onTicketChange({ ...ticket, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          value={ticket?.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={ticket?.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={ticket?.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
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
            onChange={(e) => handleChange("priority", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
    </form>
  );
}