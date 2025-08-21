import prisma from "@/lib/db";

export async function logActivity({
  type,
  message,
  userId,
  projectId,
  ticketId,
  sprintId,
}) {
  try {
    await prisma.activity.create({
      data: {
        type,
        message,
        userId,
        projectId,
        ticketId,
        sprintId,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
