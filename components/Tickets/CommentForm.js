'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { createComment } from '@/lib/api';

export default function CommentForm({ ticketId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await createComment(ticketId, content);
      onCommentAdded(newComment);
      setContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        rows={3}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-2 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}