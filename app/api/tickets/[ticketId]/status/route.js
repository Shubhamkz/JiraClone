import { logActivity } from "@/lib/activity";
import { ActivityType } from "@/lib/activityType";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { columns } from "@/lib/utils";
import { TicketStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const param = await params;
    const body = await req.json();
    const ticketId = Number(param.ticketId);
    const session = await auth();
    const { status } = body;
    const formatStatus = columns.find(item => item.id === status);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { message: "Invalid ticket id" },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    const project = await prisma.project.findUnique({
      where: {
        id: ticket.projectId,
      },
    });

    await logActivity({
      type: ActivityType.TICKET_STATUS_CHANGED,
      message: `${project.key}-${ticket.id} is moved to ${formatStatus.title}`,
      userId: session.user.id ? parseInt(session.user.id) : null,
      projectId: parseInt(body.projectId),
    });

    // Validate status
    if (!Object.values(TicketStatus).includes(status)) {
      return NextResponse.json(
        { message: "Invalid ticket status" },
        { status: 400 }
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedTicket, { status: 200 });
  } catch (error) {
    console.error("Error updating ticket status:", error);

    return NextResponse.json(
      { message: "Failed to update ticket status" },
      { status: 500 }
    );
  }
}
