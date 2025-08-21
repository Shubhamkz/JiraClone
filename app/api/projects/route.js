import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Helper function to validate project data
const validateProjectData = (data) => {
  if (!data.name || data.name.length < 3) {
    return {
      valid: false,
      error: "Project name must be at least 3 characters",
    };
  }
  if (!data.key || data.key.length < 2 || data.key.length > 10) {
    return { valid: false, error: "Project key must be 2-10 characters" };
  }
  return { valid: true };
};

// GET all projects for the current user
export async function GET(request) {
  try {
    // Simulating logged-in user
    const currentUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar_url: "https://example.com/avatar.jpg",
    };

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: currentUser.id },
          { members: { some: { userId: currentUser.id } } },
        ],
      },
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
        tickets: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            tickets: true,
            sprints: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Add completion metrics
    const projectsWithMetrics = projects.map((project) => {
      const totalTickets = project.tickets.length;
      const doneTickets = project.tickets.filter(
        (t) => t.status === "done"
      ).length;

      const completionPercentage =
        totalTickets > 0 ? Math.round((doneTickets / totalTickets) * 100) : 0;

      return {
        ...project,
        completion: {
          totalTickets,
          doneTickets,
          completionPercentage,
        },
      };
    });

    return NextResponse.json(projectsWithMetrics);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// CREATE a new project
export async function POST(request) {
  try {
    // const currentUser = await getCurrentUser();
    const currentUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      avatar_url: "https://example.com/avatar.jpg",
    };

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateProjectData(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Check if project key already exists
    const existingProject = await prisma.project.findUnique({
      where: { key: body.key },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "Project key already exists" },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        key: body.key.toUpperCase(),
        ownerId: currentUser.id,
        members: {
          create: {
            userId: currentUser.id,
            role: "owner",
          },
        },
      },
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
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
