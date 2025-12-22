import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request) {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar_url: true },
        },
        project: { select: { id: true, name: true } },
        ticket: { select: { id: true, title: true } },
        sprint: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // fetch latest 20
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
