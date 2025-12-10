import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // adjust this path to where your prisma client is

// GET /api/projects/:projectId/tickets
export async function GET(request, { params }) {
  try {
    const param = await params;

    const projectId = parseInt(param.id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid projectId" },
        { status: 400 }
      );
    }

    const tickets = await prisma.ticket.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatar_url: true },
        },
        reporter: {
          select: { id: true, name: true, email: true, avatar_url: true },
        },
        sprint: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { message: "Failed to fetch tickets", error: error.message },
      { status: 500 }
    );
  }
}
