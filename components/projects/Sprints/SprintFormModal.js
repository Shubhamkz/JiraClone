'use client';

import { useState } from 'react';
import { format, addDays } from 'date-fns';
import Modal from '@/components/ui/Modal';
import { createSprint, updateSprint } from '@/lib/api';

export default function SprintFormModal({ projectId, sprint, onClose, onSuccess }) {
  const [name, setName] = useState(sprint?.name || '');
  const [goal, setGoal] = useState(sprint?.goal || '');
  const [startDate, setStartDate] = useState(
    sprint?.startDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    sprint?.endDate || format(addDays(new Date(), 14), 'yyyy-MM-dd')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const sprintData = {
        name,
        goal,
        startDate,
        endDate,
        projectId,
        status: sprint?.status || 'planned'
      };

      let result;
      if (sprint) {
        result = await updateSprint(sprint.id, sprintData);
      } else {
        result = await createSprint(sprintData);
      }
      
      onSuccess(result);
    } catch (err) {
      setError(err.message || 'Failed to save sprint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={sprint ? 'Edit Sprint' : 'Create Sprint'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sprint Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Sprint'}
          </button>
        </div>
      </form>
    </Modal>
  );
}