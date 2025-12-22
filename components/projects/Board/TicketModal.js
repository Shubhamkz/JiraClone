"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { updateTicket, updateTicketAssignee } from "@/lib/api";
import TicketHeader from "./TicketHeader";
import TicketDetails from "./TicketDetails";
import TicketEditForm from "./TicketEditForm";
import TicketActions from "./TicketActions";
import TimeEntryList from "./TimeEntryList";

export default function TicketModal({
  ticket: initialTicket,
  onClose,
  onUpdate,
  projectKey,
  users = [], // Add users prop for assignee selection
}) {
  const [ticket, setTicket] = useState(initialTicket);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);

  const handleTicketUpdate = async (updates) => {
    setIsLoading(true);
    try {
      const updatedTicket = await updateTicket(ticket.id, updates);
      setTicket(updatedTicket);
      onUpdate(updatedTicket);
      return updatedTicket;
    } catch (error) {
      console.error("Failed to update ticket:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssigneeUpdate = async (userId) => {
    setIsLoading(true);
    try {
      const updatedTicket = await updateTicketAssignee(ticket.id, userId);
      setTicket(updatedTicket);
      onUpdate(updatedTicket);
      setIsEditingAssignee(false);
    } catch (error) {
      console.error("Failed to update assignee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleTicketUpdate(ticket);
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${projectKey}-${ticket?.id}`}
    >
      <div className="space-y-6">
        {!isEditing ? (
          <>
            <TicketHeader ticket={ticket} onEdit={() => setIsEditing(true)} />
            <TicketDetails
              ticket={ticket}
              users={users}
              isEditingAssignee={isEditingAssignee}
              onAssigneeEdit={() => setIsEditingAssignee(!isEditingAssignee)}
              onAssigneeSelect={handleAssigneeUpdate}
            />
          </>
        ) : (
          <TicketEditForm
            ticket={ticket}
            onTicketChange={setTicket}
            onSubmit={handleSubmit}
          />
        )}

        <TicketActions
          isEditing={isEditing}
          isLoading={isLoading}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onClose={onClose}
          onSubmit={handleSubmit}
        />

        <div className="mt-6">
          <TimeEntryList />
        </div>
      </div>
    </Modal>
  );
}
