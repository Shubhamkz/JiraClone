'use client';

import { useState } from 'react';
import ActiveSprint from './ActiveSprint';
import SprintList from './SprintList';
import SprintFormModal from './SprintFormModal';

export default function SprintsView({ projectId, initialSprints = [], projectKey }) {
  const [sprints, setSprints] = useState(initialSprints);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);

  const activeSprint = sprints.find(sprint => sprint.status === 'active');
  const plannedSprints = sprints.filter(sprint => sprint.status === 'planned');
  const completedSprints = sprints.filter(sprint => sprint.status === 'completed');

  const handleCreateSprint = () => {
    setEditingSprint(null);
    setIsFormOpen(true);
  };

  const handleEditSprint = (sprint) => {
    setEditingSprint(sprint);
    setIsFormOpen(true);
  };

  const handleFormSuccess = (sprint) => {
    if (editingSprint) {
      setSprints(sprints.map(s => s.id === sprint.id ? sprint : s));
    } else {
      setSprints([...sprints, sprint]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col space-y-8">
      {activeSprint && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Sprint</h2>
          <ActiveSprint 
            sprint={activeSprint} 
            projectKey={projectKey}
            onEdit={handleEditSprint}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Planned Sprints</h2>
            <button
              onClick={handleCreateSprint}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Sprint
            </button>
          </div>
          <SprintList 
            sprints={plannedSprints} 
            projectKey={projectKey}
            onEdit={handleEditSprint}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Completed Sprints</h2>
          <SprintList 
            sprints={completedSprints} 
            projectKey={projectKey}
            onEdit={handleEditSprint}
          />
        </div>
      </div>

      {isFormOpen && (
        <SprintFormModal
          projectId={projectId}
          sprint={editingSprint}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}