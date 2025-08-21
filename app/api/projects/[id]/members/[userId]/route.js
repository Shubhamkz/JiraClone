import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// UPDATE project member role
export async function PUT(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if current user is project owner
    const project = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only project owner can update member roles' },
        { status: 403 }
      );
    }

    const { role } = await request.json();

    // Cannot change owner's role
    if (parseInt(params.userId) === project.ownerId) {
      return NextResponse.json(
        { error: 'Cannot change owner role' },
        { status: 400 }
      );
    }

    const updatedMember = await prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId: parseInt(params.id),
          userId: parseInt(params.userId),
        },
      },
      data: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Failed to update project member:', error);
    return NextResponse.json(
      { error: 'Failed to update project member' },
      { status: 500 }
    );
  }
}

// REMOVE member from project
export async function DELETE(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if current user is project owner
    const project = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only project owner can remove members' },
        { status: 403 }
      );
    }

    // Cannot remove owner
    if (parseInt(params.userId) === project.ownerId) {
      return NextResponse.json(
        { error: 'Cannot remove project owner' },
        { status: 400 }
      );
    }

    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: parseInt(params.id),
          userId: parseInt(params.userId),
        },
      },
    });

    return NextResponse.json(
      { message: 'Member removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to remove project member:', error);
    return NextResponse.json(
      { error: 'Failed to remove project member' },
      { status: 500 }
    );
  }
}