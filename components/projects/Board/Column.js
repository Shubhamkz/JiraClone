"use client";

// src/components/projects/Board/Column.js
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Ticket from "./Ticket";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateTicketForm from "./CreateTicketForm";
import { useState } from "react";

export default function Column({
  column,
  tickets,
  onTicketClick,
  projectKey,
  setIsModalOpen,
  projectId
}) {
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  return (
    <div className="flex flex-col w-72 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">
          {column.title}{" "}
          <span className="text-gray-500">({tickets.length})</span>
        </h3>
        {column.id !== "backlog" && column.id !== "done" && (
          <button
            onClick={() => setIsCreatingTicket(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <Droppable
        ignoreContainerClipping={false}
        droppableId={column.id}
        isCombineEnabled={false}
        isDropDisabled={false} // Explicitly set to boolean
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 overflow-y-auto min-h-[100px] ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {isCreatingTicket && (
              <CreateTicketForm
                status={column.id}
                projectKey={projectKey}
                onCancel={() => setIsCreatingTicket(false)}
                onSuccess={(newTicket) => {
                  onTicketClick(newTicket);
                  setIsCreatingTicket(false);
                }}
                projectId={projectId}
              />
            )}

            {tickets.map((ticket, index) => (
              <Ticket
                key={ticket.id}
                ticket={ticket}
                index={index}
                onClick={() => onTicketClick(ticket)}
                setIsModalOpen={setIsModalOpen}
                projectKey={projectKey}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
