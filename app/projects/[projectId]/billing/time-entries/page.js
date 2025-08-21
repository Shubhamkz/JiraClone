import { getProject, getTimeEntries } from "@/lib/api";
import TimeEntryList from "@/components/billing/TimeEntryList";

export default async function TimeEntriesPage({ params }) {
  const { projectId } = params;

  const [project, timeEntries] = await Promise.all([
    getProject(projectId),
    getTimeEntries(projectId),
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Time Entries - {project.name}
        </h1>
      </div>

      <TimeEntryList />
    </div>
  );
}
