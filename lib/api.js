import {
  generateDummyActivities,
  generateDummyBillingReport,
  generateDummyMetrics,
  generateDummyProject,
  generateDummyProjects,
  generateDummySprints,
  generateDummyTicket,
  generateDummyTickets,
  generateDummyUsers,
} from "./dummyData";

export async function deleteProject(projectId) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete project");
    }

    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Helper function to construct proper API URLs
function getApiUrl(path, queryParams = {}) {
  if (typeof window === "undefined") {
    // Server-side - use absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `${baseUrl}/api/${path}${queryString ? `?${queryString}` : ""}`;
  } else {
    // Client-side - use relative URL
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `/api/${path}${queryString ? `?${queryString}` : ""}`;
  }
}

export async function getProjects() {
  try {
    const res = await fetch(getApiUrl("projects"));

    if (!res.ok) {
      return generateDummyProjects();
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyProjects();
  }
}

export async function getProject(projectId, cookieHeader) {
  try {
    const res = await fetch(getApiUrl(`projects/${projectId}`), {
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
      // If the API returns an error, return dummy data
      return generateDummyProject(projectId);
    }

    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyProject(projectId);
  }
}

export async function getTickets(projectId, sprintId, cookieHeader) {
  try {
    const params = { projectId };
    if (sprintId) params.sprintId = sprintId;

    const res = await fetch(getApiUrl(`projects/${projectId}/tickets`), {
      headers: { Cookie: cookieHeader },
    });

    if (res.status !== 200) {
      return generateDummyTickets(projectId);
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyTickets(projectId);
  }
}

export async function getUsers(filters = {}, cookieHeader) {
  try {
    const res = await fetch(getApiUrl("users", filters), {
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
      return generateDummyUsers();
    }

    const data = await res.json();
    return data || generateDummyUsers();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyUsers();
  }
}

export async function getSprints(projectId, cookieHeader) {
  try {
    const res = await fetch(getApiUrl(`projects/${projectId}/sprints`), {
      headers: { Cookie: cookieHeader },
    });

    if (!res.ok) {
      return generateDummySprints(projectId);
    }

    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummySprints(projectId);
  }
}

export async function getSprintMetrics() {
  try {
    const res = await fetch(getApiUrl("metrics"));
    if (!res.ok) return generateDummyMetrics();
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyMetrics();
  }
}

export async function getRecentActivity() {
  try {
    const res = await fetch(getApiUrl("activity"));
    if (!res.ok) return generateDummyActivities();
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyActivities();
  }
}

export async function getTicket(ticketId) {
  try {
    const res = await fetch(getApiUrl("tickets", { id: ticketId }));
    const data = Object.keys(res);

    if (!res.ok || !data.length) {
      console.log("data 🤣🤣😁", data);
      return generateDummyTicket(ticketId);
    }

    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyTicket(ticketId);
  }
}

export async function createTicket(ticketData) {
  try {
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });
    if (!res.ok) {
      throw new Error("Failed to create ticket");
    }
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getBillingReport(projectId, startDate, endDate) {
  try {
    const res = await fetch(
      getApiUrl("billing/reports", {
        projectId,
        startDate,
        endDate,
      })
    );

    if (!res.ok) {
      return generateDummyBillingReport();
    }

    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return generateDummyBillingReport();
  }
}
