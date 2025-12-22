export default function TicketActions({
  isEditing,
  isLoading,
  onEdit,
  onCancel,
  onClose,
  onSubmit,
}) {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      {!isEditing ? (
        <>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 font-medium text-white text-xs shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={onSubmit}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  );
}