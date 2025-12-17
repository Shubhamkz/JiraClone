import ProjectNavbar from "@/components/ProjectNavbar";
import BacklogItem from "@/components/projects/Backlog/BacklogItem";
import Filters from "@/components/projects/Backlog/Filters";
import { getProject, getTickets, getSprints } from "@/lib/api";
import { cookies } from "next/headers";

export default async function BacklogPage({ params }) {
  const { projectId } = params;
  const cookie = await cookies();
  const cookieHeader = cookie.toString();

  // Fetch data in parallel
  const [project, tickets, sprints] = await Promise.all([
    getProject(projectId, cookieHeader),
    getTickets(projectId, null, cookieHeader),
    getSprints(projectId, cookieHeader),
  ]);

  return (
    <div className="flex flex-col h-full px-20 py-8">
      <ProjectNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Backlog: {project.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your project backlog and plan future sprints
        </p>
      </div>

      <div className="px-6 pb-4">
        <Filters sprints={sprints} />
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-500">
            <div className="col-span-1">Type</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Assignee</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1">Points</div>
            <div className="col-span-2">Actions</div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[50vh] overflow-y-scroll">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <BacklogItem
                  key={ticket.id}
                  ticket={ticket}
                  projectId={projectId}
                  availableSprints={sprints}
                />
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No tickets in backlog. Create a new ticket to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
