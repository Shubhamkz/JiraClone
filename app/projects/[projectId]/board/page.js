import ProjectNavbar from "@/components/ProjectNavbar";
import BoardView from "@/components/projects/Board/BoardView";
import BoardViewWrapper from "@/components/projects/Board/BoardViewWrapper";
import { getProject, getTickets } from "@/lib/api";
import { cookies } from "next/headers";


export default async function BoardPage({ params }) {
  // No need to await params - it's automatically resolved in Server Components
  const { projectId } = await params;
  const cookie = await cookies();
  const cookieHeader = cookie.toString();
 
  try {
    // Fetch project and tickets in parallel
    const [project, tickets] = await Promise.all([
      getProject(projectId, cookieHeader),
      getTickets(projectId, null, cookieHeader),
    ]);

    return (
      <div className="flex flex-col h-full px-20 py-8">
        <ProjectNavbar />
        <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-12">
          {project.name} Board
        </h1>
        <BoardViewWrapper
          projectId={projectId}
          initialTickets={tickets}
          projectKey={project.key}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading board:", error);
    return (
      <div className="flex flex-col h-full">
        <ProjectNavbar />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Project Board</h1>
        <BoardViewWrapper
          projectId={projectId}
          initialTickets={[]}
          projectKey="PRJ"
        />
      </div>
    );
  }
}
