import prisma from "@/lib/db";
import ActivityMessage from "./activityMessages";

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
        message: message || ActivityMessage[type],
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
 