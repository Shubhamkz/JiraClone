import ProjectSettingsForm from '@/components/projects/settings/ProjectSettingsForm';
import DangerZone from '@/components/projects/settings/DangerZone';
import TeamMembers from '@/components/projects/settings/TeamMembers';
import { getProject, getUsers } from '@/lib/api';
import ProjectNavbar from '@/components/ProjectNavbar';
import { cookies } from 'next/headers';

export default async function ProjectSettingsPage({ params }) {
  const { projectId } = params;
  const cookie = await cookies();
  const cookieHeader = cookie.toString();
  
  const [project, users] = await Promise.all([
    getProject(projectId, cookieHeader),
    getUsers({}, cookieHeader),
  ]);

  return (
    <div className="space-y-8 px-20 py-8">
     <ProjectNavbar />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Project Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your project configuration and team members
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Project Details
            </h2>
            <ProjectSettingsForm project={project} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Team Members
            </h2>
            <TeamMembers 
              project={project} 
              availableUsers={users} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Project Key
            </h2>
            <div className="flex items-center">
              <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm">
                {project.key}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                Used in ticket IDs (e.g. {project.key}-123)
              </span>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border border-red-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Danger Zone
            </h2>
            <DangerZone projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}