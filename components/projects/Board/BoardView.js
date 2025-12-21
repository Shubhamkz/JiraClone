"use client";

import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import TicketModal from "./TicketModal";
import { updateTicketStatus } from "@/lib/api";
import NoTicketsPlaceholder from "@/components/Tickets/NoTicketsPlaceholder";

const columns = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" },
];

export default function BoardView({
  projectId,
  initialTickets = [],
  projectKey = "PRJ",
  onTicketCreated
}) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  // Group tickets by status
  const ticketsByStatus = columns.reduce((acc, column) => {
    acc[column.id] = tickets.filter((ticket) => ticket.status === column.id);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const updatedTickets = [...tickets];
    const ticketIndex = updatedTickets.findIndex(
      (t) => t.id.toString() === draggableId
    );
    const ticket = updatedTickets[ticketIndex];

    if (ticket) {
      // Don't update status for dummy data
      if (!ticket.isDummy) {
        ticket.status = destination.droppableId;
        updatedTickets[ticketIndex] = ticket;
        setTickets(updatedTickets);

        try {
          await updateTicketStatus(draggableId, destination.droppableId);
        } catch (error) {
          // Revert if API call fails
          ticket.status = source.droppableId;
          updatedTickets[ticketIndex] = ticket;
          setTickets(updatedTickets);
        }
      } else {
        // For dummy data, just update locally
        ticket.status = destination.droppableId;
        updatedTickets[ticketIndex] = ticket;
        setTickets(updatedTickets);
      }
    }
  };

  return (
    <>
      <div className="flex-1 overflow-x-auto pb-4">
        {tickets.length === 0 ? (
          <NoTicketsPlaceholder projectId={projectId}/>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex space-x-4 min-w-max">
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tickets={ticketsByStatus[column.id] || []}
                  onTicketClick={setSelectedTicket}
                  projectKey={projectKey}
                  setIsModalOpen={setIsModalOpen}
                  projectId={projectId}
                  onTicketCreated={onTicketCreated}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {isModalOpen && (
        <TicketModal
          ticket={selectedTicket}
          projectId={projectId}
          projectKey={projectKey}
          onClose={() => setIsModalOpen(false)}
          onUpdate={(updatedTicket) => {
            setTickets(
              tickets.map((t) =>
                t.id === updatedTicket.id ? updatedTicket : t
              )
            );
          }}
        />
      )}
    </>
  );
}
