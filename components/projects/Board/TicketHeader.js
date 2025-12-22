import { getPriorityIcon } from "@/lib/utils";

export default function TicketHeader({ ticket, onEdit }) {
  const PriorityIcon = getPriorityIcon(ticket?.priority || "low");

  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {ticket?.title}
        </h2>
        <div className="flex items-center space-x-3">
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
      <button
        type="button"
        onClick={onEdit}
        className="ml-4 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 p-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Edit ticket"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>
  );
}