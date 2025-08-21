import { format, parseISO } from "date-fns";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

export default function ActiveSprint({ sprint, projectKey, onEdit }) {
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))
  );
  const totalTickets = sprint.tickets ? sprint.tickets.length : 0;
  const inProgressTickets = sprint.tickets
    ? sprint.tickets.filter((ticket) => ticket.status === "in_progress").length
    : 0;
  const completedTickets = sprint.tickets
    ? sprint.tickets.filter((ticket) => ticket.status === "completed").length
    : 0;

  // Calculate progress (mock data - in real app you'd calculate based on tickets)
  const progress = Math.min(
    100,
    Math.floor(
      ((new Date() - new Date(sprint.startDate)) /
        (new Date(sprint.endDate) - new Date(sprint.startDate))) *
        100
    )
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {sprint.name} ({projectKey}-{sprint.id})
          </h3>
          <p className="text-gray-600">{sprint.goal}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => onEdit(sprint)}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Start Date</p>
          <p className="font-medium">
            {format(parseISO(sprint.startDate), "MMM d, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End Date</p>
          <p className="font-medium">
            {format(parseISO(sprint.endDate), "MMM d, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Days Remaining</p>
          <p className="font-medium">{daysRemaining} days</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{totalTickets}</p>
          <p className="text-sm text-gray-600">Total Tickets</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {completedTickets}
          </p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-2xl font-bold text-yellow-600">
            {inProgressTickets}
          </p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>
      </div>
    </div>
  );
}
