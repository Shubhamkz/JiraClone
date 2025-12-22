import prisma from "@/lib/db";
import { TicketStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const param = await params;
    const ticketId = Number(param.ticketId);

    if (isNaN(ticketId)) {
      return NextResponse.json(
        { message: "Invalid ticket id" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

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
