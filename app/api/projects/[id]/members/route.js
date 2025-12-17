import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET all members of a project
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

    const members = await prisma.projectMember.findMany({
      where: {
        projectId: parseInt(params.id),
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

    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to fetch project members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project members' },
      { status: 500 }
    );
  }
}

// ADD a member to a project
export async function POST(request, { params }) {
  const param = await params;
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
      where: { id: parseInt(param.id) },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only project owner can add members' },
        { status: 403 }
      );
    }

    const { email, role } = await request.json();

    // Find user by email
    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      return NextResponse.json(
        { error: 'User with this email not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId: parseInt(params.id),
        userId: userToAdd.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this project' },
        { status: 400 }
      );
    }

    // Add user to project
    const newMember = await prisma.projectMember.create({
      data: {
        projectId: parseInt(params.id),
        userId: userToAdd.id,
        role: role || 'member',
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

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Failed to add project member:', error);
    return NextResponse.json(
      { error: 'Failed to add project member' },
      { status: 500 }
    );
  }
}