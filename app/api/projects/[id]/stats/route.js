import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET project statistics
export async function GET(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user has access to this project
    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId: parseInt(params.id),
        userId: currentUser.id,
      },
    });

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not authorized to access this project' },
        { status: 403 }
      );
    }

    // Get ticket counts by status
    const ticketCounts = await prisma.ticket.groupBy({
      by: ['status'],
      where: {
        projectId: parseInt(params.id),
      },
      _count: {
        status: true,
      },
    });

    // Get sprint statistics
    const sprintStats = await prisma.sprint.findMany({
      where: {
        projectId: parseInt(params.id),
        status: 'completed',
      },
      orderBy: {
        endDate: 'desc',
      },
      take: 5,
      include: {
        _count: {
          select: {
            tickets: true,
          },
        },
      },
    });

    // Get recent activity
    const recentActivity = await prisma.ticket.findMany({
      where: {
        projectId: parseInt(params.id),
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        assignee: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      ticketCounts,
      sprintStats,
      recentActivity,
    });
  } catch (error) {
    console.error('Failed to fetch project stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project stats' },
      { status: 500 }
    );
  }
}