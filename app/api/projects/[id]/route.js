import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET a single project by ID
export async function GET(request, { params }) {
  try {
    // const currentUser = await getCurrentUser();
    // if (!currentUser) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    const currentUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar_url: "https://example.com/avatar.jpg",
    };

    const project = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar_url: true,
              },
            },
          },
        },
        sprints: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        _count: {
          select: {
            tickets: true,
            sprints: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user has access to this project
    const isMember = project.members.some(
      (member) => member.userId === currentUser.id
    );
    if (!isMember && project.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: "Not authorized to access this project" },
        { status: 403 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// UPDATE a project
export async function PUT(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateProjectData(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // First check if project exists and user is owner
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        members: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: "Only project owner can update the project" },
        { status: 403 }
      );
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        description: body.description,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        members: {
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
        },
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(request, { params }) {
  try {
    // const currentUser = await getCurrentUser();
    // if (!currentUser) {
    //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    // }

    const currentUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar_url: "https://example.com/avatar.jpg",
    };

    // First check if project exists and user is owner
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.ownerId !== currentUser.id) {
      return NextResponse.json(
        { error: "Only project owner can delete the project" },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
