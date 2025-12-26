"use client";

import { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import ProjectCard from "@/components/dashboard/ProjectCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProgressChart from "@/components/dashboard/ProgressChart";
import { getProjects, getRecentActivity } from "@/lib/api";
import TimeTrackDashboard from "@/components/billing/TimeTrackDashboard";
import NewProject from "@/components/projects/settings/NewProject";
import Client from "@/lib/Client";
import Loader from "@/components/ui/Loader";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const user = null;
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const isAdmin = false;
  const { totalTickets, doneTickets, totalSprints } = projects.reduce(
    (acc, project) => {
      acc.totalTickets += project.tickets.length;
      acc.doneTickets += project.tickets.filter(
        (t) => t.status === "done"
      ).length;
      acc.totalSprints += project._count.sprints;
      return acc;
    },
    { totalTickets: 0, doneTickets: 0, totalSprints: 0 }
  );

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projectsData, activitiesData] = await Promise.all([
          getProjects(),
          getRecentActivity(),
        ]);
        setProjects(projectsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.status === activeFilter);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [projectsData, activitiesData] = await Promise.all([
        getProjects(),
        getRecentActivity(),
      ]);
      setProjects(projectsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your projects today
          </p>
        </div>
        <div className="flex gap-2">
          <Client>
            <NewProject refreshData={refreshData} />
          </Client>
          <button
            onClick={refreshData}
            className="flex items-center mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button onClick={() => signOut()} className="flex items-center mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Logout
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Projects
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {projects?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Tasks Completed
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {doneTickets || 0}/{totalTickets || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Team Members</p>
              <p className="text-2xl font-semibold text-gray-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Sprints
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalSprints || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Projects
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeFilter === "all"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter("active")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeFilter === "active"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setActiveFilter("archived")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      activeFilter === "archived"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Archived
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects found</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Project Progress
            </h2>
            <ProgressChart projects={projects} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="p-4">
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </div>

      {isAdmin && <TimeTrackDashboard />}
    </div>
  );
}
