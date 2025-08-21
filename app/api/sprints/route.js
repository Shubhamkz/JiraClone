import { NextResponse } from "next/server";
import prisma from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();

    const newSprint = await prisma.sprint.create({
      data: {
        name: body.name,
        goal: body.goal || null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        projectId: parseInt(body.projectId),
        status: body.status || "planned",
      },
    });

    return NextResponse.json(newSprint, { status: 201 });
  } catch (error) {
    console.error("Error creating sprint:", error);
    return NextResponse.json(
      { error: "Failed to create sprint" },
      { status: 500 }
    );
  }
}
