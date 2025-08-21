'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Button from '@/components/ui/Button';
import TimeEntryForm from '@/components/billing/TimeEntryForm';

export default function TimeEntryList({ timeEntries = [], project = null }) {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  
  // Generate dummy data if no entries provided
  const entries = timeEntries.length > 0 ? timeEntries : generateDummyTimeEntries(project?.id);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (entryId) => {
    // Implement delete functionality
    console.log('Deleting entry:', entryId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Time Entries</h2>
        <Button onClick={() => setShowForm(true)}>
          Add Time Entry
        </Button>
      </div>

      {showForm && (
        <TimeEntryForm
          project={project || generateDummyProject()}
          onClose={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
          initialData={editingEntry}
          onSuccess={(newEntry) => {
            // Handle successful form submission
            setShowForm(false);
            setEditingEntry(null);
          }}
        />
      )}

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Description
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Hours
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Rate
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                  {format(new Date(entry.date), 'MMM d, yyyy')}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {entry.description || 'No description'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {entry.hours.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  ${entry.billingRate?.toFixed(2) || '0.00'}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  ${((entry.hours || 0) * (entry.billingRate || 0)).toFixed(2)}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No time entries found</p>
        </div>
      )}
    </div>
  );
}

// Dummy data generators
function generateDummyTimeEntries(projectId = 1) {
  const baseDate = new Date();
  return [
    {
      id: 1,
      date: new Date(baseDate.setDate(baseDate.getDate() - 2)).toISOString(),
      description: 'Implemented user authentication',
      hours: 4.5,
      billingRate: 75.00,
      projectId,
      isDummy: true
    },
    {
      id: 2,
      date: new Date(baseDate.setDate(baseDate.getDate() - 1)).toISOString(),
      description: 'Fixed login page styling',
      hours: 2.0,
      billingRate: 75.00,
      projectId,
      isDummy: true
    },
    {
      id: 3,
      date: new Date().toISOString(),
      description: 'API endpoint development',
      hours: 6.25,
      billingRate: 85.00,
      projectId,
      isDummy: true
    }
  ];
}

function generateDummyProject() {
  return {
    id: 1,
    name: 'Sample Project',
    key: 'SP',
    isDummy: true
  };
}