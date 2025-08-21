import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // make sure you have prisma client instance in lib/prisma.js

// GET /api/sprints?projectId=123
export async function GET(request, { params }) {
  try {
    const projectId = parseInt(params.id);

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      );
    }

    const sprints = await prisma.sprint.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        tickets: true, // remove if you don’t want tickets in response
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sprints, { status: 200 });
  } catch (error) {
    console.error("Error fetching sprints:", error);
    return NextResponse.json(
      { error: "Failed to fetch sprints" },
      { status: 500 }
    );
  }
}
