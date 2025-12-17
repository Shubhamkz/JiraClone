import { getTicket, getProject } from '@/lib/api';
import TicketDetail from '@/components/Tickets/TicketDetail';

export default async function TicketPage({ params }) {
  const { projectId, ticketId } = params;

  try {
    const [ticket, project] = await Promise.all([
      getTicket(ticketId),
      getProject(projectId)
    ]);

    return (
      <div className="max-w-4xl mx-auto p-6">
        <TicketDetail ticket={ticket} project={project} />
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold text-gray-800">Ticket Not Found</h1>
          <p className="mt-2 text-gray-600">
            The requested ticket could not be loaded.
          </p>
        </div>
      </div>
    );
  }
}