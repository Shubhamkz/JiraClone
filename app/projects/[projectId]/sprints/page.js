import { getProject, getSprints } from "@/lib/api";
import SprintsView from "@/components/projects/Sprints/SprintsView";
import ProjectNavbar from "@/components/ProjectNavbar";
import { cookies } from "next/headers";

export default async function SprintsPage({ params }) {
  const { projectId } = params;
  const cookieHeader = await cookies().toString();

  try {
    const [project, sprints] = await Promise.all([
      getProject(projectId, cookieHeader),
      getSprints(projectId, cookieHeader),
    ]);

    return (
      <div className="flex flex-col h-full px-20 py-8">
        <ProjectNavbar />
        <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-10">
          {project.name} Sprints
        </h1>
        <SprintsView
          projectId={projectId}
          initialSprints={sprints}
          projectKey={project.key}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading sprints:", error);
    return (
      <div className="flex flex-col h-full px-20 py-8 ">
        <ProjectNavbar />
        <h1 className="text-2xl font-bold text-gray-800 mb-6 mt-10">
          Project Sprints
        </h1>
        <SprintsView
          projectId={projectId}
          initialSprints={[]}
          projectKey="PRJ"
        />
      </div>
    );
  }
}
