
export default function TicketDetails({
  ticket,
  users,
  isEditingAssignee,
  onAssigneeEdit,
  onAssigneeSelect,
}) {
  const handleAssigneeClick = (userId) => {
    onAssigneeSelect(userId);
  };

  return (
    <>
      <div className="prose max-w-none mb-6">
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
        
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-500">Assignee</h3>
            <button
              type="button"
              onClick={onAssigneeEdit}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Edit assignee"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
          
          {isEditingAssignee ? (
            <div className="mt-2 absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="max-h-40 overflow-y-auto py-1">
                <button
                  type="button"
                  onClick={() => handleAssigneeClick(null)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Unassigned
                </button>
                {users?.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleAssigneeClick(user.id)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{user.name}</span>
                    {ticket?.assignee?.id === user.id && (
                      <span className="ml-auto text-blue-600">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-900">
              {ticket?.assignee ? ticket.assignee.name : "Unassigned"}
            </p>
          )}
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
  );
}