import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { logActivity } from "@/lib/activity";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const sprintId = searchParams.get("sprintId");

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        projectId: projectId ? parseInt(projectId) : undefined,
        sprintId: sprintId ? parseInt(sprintId) : undefined,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    await logActivity({
      type: "TICKET_CREATED", // Possible types: PROJECT_CREATED, TICKET_CREATED, etc.
      message: `Project was created`,
      userId: body.assigneeId ? parseInt(body.assigneeId) : null,
      projectId: body.projectId,
    });

    const newTicket = await prisma.ticket.create({
      data: {
        ...body,
        projectId: parseInt(body.projectId),
        sprintId: body.sprintId ? parseInt(body.sprintId) : null,
        assigneeId: body.assigneeId ? parseInt(body.assigneeId) : null,
        reporterId: parseInt(body.reporterId),
      },
    });
    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    // Log detailed info to the server console
    console.error("Ticket creation failed:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      meta: error.meta,
    });

    return NextResponse.json(
      {
        message: "Failed to create ticket",
        error: {
          name: error.name,
          message: error.message,
          meta: error.meta || null,
        },
      },
      { status: 500 }
    );
  }
}
