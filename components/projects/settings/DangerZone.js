"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/lib/api";

export default function DangerZone({ projectId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteProject = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteProject(projectId);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="border-t border-red-200 pt-4">
        <h3 className="text-sm font-medium text-red-800">
          Delete this project
        </h3>
        <p className="text-sm text-red-600 mt-1">
          Once you delete a project, there is no going back. Please be certain.
        </p>
        <button
          type="button"
          onClick={handleDeleteProject}
          disabled={isDeleting}
          className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete Project"}
        </button>
      </div>
    </div>
  );
}
