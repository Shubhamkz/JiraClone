// src/components/projects/Board/BoardView.client.js
'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const BoardView = dynamic(
  () => import('./BoardView'),
  { 
    ssr: false,
    loading: () => <div>Loading...</div>
  }
);

export default function BoardViewWrapper(props) {
  const router = useRouter();

  const handleRefresh = async () => {
    router.refresh(); 
  };

  return (
    <BoardView onTicketCreated={handleRefresh} {...props} />
  );
}