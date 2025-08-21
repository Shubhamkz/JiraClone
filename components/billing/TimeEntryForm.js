'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { createTimeEntry } from '@/lib/api';

export default function TimeEntryForm({ 
  ticket, 
  project, 
  user, 
  onSuccess, 
  onClose 
}) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ticket) {
      setValue('ticketId', ticket.id);
      setValue('projectId', ticket.projectId);
      setValue('description', `Work on ${ticket.title}`);
    }
    if (project) setValue('projectId', project.id);
    if (user) setValue('userId', user.id);
    setValue('date', new Date().toISOString().split('T')[0]);
  }, [ticket, project, user, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const newEntry = await createTimeEntry(data);
      onSuccess(newEntry);
      reset();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save time entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Log Time">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            {...register('date', { required: true })}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hours
          </label>
          <input
            type="number"
            step="0.25"
            min="0.25"
            max="24"
            {...register('hours', { required: true })}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description', { required: true })}
            rows={3}
            className="w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <input type="hidden" {...register('userId')} />
        <input type="hidden" {...register('projectId')} />
        {ticket && <input type="hidden" {...register('ticketId')} />}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}