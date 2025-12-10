import { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { motion } from "framer-motion";

// Import your custom components
import {
  Button,
  Card,
  CardContent,
  Dialog,
  Input,
  Textarea,
  Select
} from "../ui/NoTicketUi";

import { createTicket } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function NoTicketsPlaceholder({ projectId }) {
  const { data: session, status: loggedInStatus } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "task",
    priority: "medium",
    status: "backlog",
    projectId: projectId,
    reporterId: session?.user?.id || null,
  });

  const handleCreate = async () => {
    try {
      setLoading(true);
      await createTicket(form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="bg-blue-50 border-blue-200 shadow-xl rounded-2xl p-6">
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="w-14 h-14 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              No Tickets Found
            </h2>
            <p className="text-blue-600 mb-6">
              Create your first ticket to get started with your project workflow.
            </p>

            {/* Custom Dialog */}
            <Dialog
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex gap-2 mx-auto">
                  <Plus /> Create Ticket
                </Button>
              }
            >
              {/* Modal Content */}
              <div className="space-y-4">

                <h2 className="text-xl font-semibold text-blue-700">
                  Create New Ticket
                </h2>

                <Input
                  placeholder="Ticket title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />

                <Textarea
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      items={["story", "bug", "task", "epic"]}
                      value={form.type}
                      onChange={(val) => setForm({ ...form, type: val })}
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      items={["low", "medium", "high", "critical"]}
                      value={form.priority}
                      onChange={(val) =>
                        setForm({ ...form, priority: val })
                      }
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </Button>
              </div>
            </Dialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
