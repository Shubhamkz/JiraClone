import { format } from 'date-fns';

export function generateDummyProject(projectId) {
  const dummyId = projectId || Math.floor(Math.random() * 1000);
  const projectKey = `PRJ${dummyId.toString().padStart(3, '0')}`.slice(0, 5).toUpperCase();
  
  return {
    id: dummyId,
    name: `Sample Project ${dummyId}`,
    key: projectKey,
    description: "This is a sample project returned as fallback",
    owner: {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      avatarUrl: null
    },
    members: [
      {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        role: "owner",
        avatarUrl: null
      },
      {
        id: 2,
        name: "Developer One",
        email: "dev1@example.com",
        role: "developer",
        avatarUrl: null
      },
      {
        id: 3,
        name: "QA Tester",
        email: "qa@example.com",
        role: "tester",
        avatarUrl: null
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDummy: true
  };
}

export function generateDummyTickets(projectId, count = 15) {
  
  const statuses = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
  const types = ['story', 'bug', 'task'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const project = generateDummyProject(projectId);

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length];
    const type = types[i % types.length];
    
    return {
      id: i + 1,
      title: `${type === 'bug' ? 'Fix' : type === 'story' ? 'Implement' : 'Complete'} ${['header', 'footer', 'login', 'API', 'database'][i % 5]} ${type === 'bug' ? 'issue' : 'feature'}`,
      description: `This is a sample ${type} description. Priority is ${priorities[i % priorities.length]}.`,
      type,
      status,
      priority: priorities[i % priorities.length],
      storyPoints: [1, 2, 3, 5, 8][i % 5],
      projectId: project.id,
      projectKey: project.key,
      assignee: i % 3 === 0 ? null : project.members[i % project.members.length],
      reporter: project.owner,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
      isDummy: true
    };
  });
}

// dummyData.ts or dummyData.js
export function generateDummyUsers(count = 5) {
  return Array.from({ length: count }).map((_, index) => ({
    id: `user-${index + 1}`,
    name: `Dummy User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index % 2 === 0 ? "Developer" : "Manager",
    avatar: "/default-avatar.png",
  }));
}

export function generateDummySprints(projectId, count = 5) {
  const now = new Date();
  const project = generateDummyProject(projectId);
  
  return [
    // Active sprint
    {
      id: 1,
      name: `Sprint ${now.getMonth() + 1}.${now.getDate()}`,
      goal: 'Complete critical features for next release',
      startDate: format(new Date(now.setDate(now.getDate() - 7)), 'yyyy-MM-dd'),
      endDate: format(new Date(now.setDate(now.getDate() + 14)), 'yyyy-MM-dd'),
      projectId: project.id,
      status: 'active',
      isDummy: true
    },
    // Planned sprints
    ...Array.from({ length: 2 }, (_, i) => ({
      id: i + 2,
      name: `Sprint ${now.getMonth() + 1}.${now.getDate() + 14 + (i * 14)}`,
      goal: ['Improve performance', 'Add new features'][i % 2],
      startDate: format(new Date(now.setDate(now.getDate() + 14 + (i * 14))), 'yyyy-MM-dd'),
      endDate: format(new Date(now.setDate(now.getDate() + 14 + (i * 14) + 13)), 'yyyy-MM-dd'),
      projectId: project.id,
      status: 'planned',
      isDummy: true
    })),
    // Completed sprints
    ...Array.from({ length: 2 }, (_, i) => ({
      id: i + 4,
      name: `Sprint ${now.getMonth()}.${now.getDate() - 21 - (i * 14)}`,
      goal: ['Bug fixes', 'Initial release preparation'][i % 2],
      startDate: format(new Date(now.setDate(now.getDate() - 21 - (i * 14) - 28)), 'yyyy-MM-dd'),
      endDate: format(new Date(now.setDate(now.getDate() - 21 - (i * 14) - 14)), 'yyyy-MM-dd'),
      projectId: project.id,
      status: 'completed',
      isDummy: true
    }))
  ];
}

// In your lib/dummyData.js
export function generateDummyMetrics() {
  return {
    activeProjects: 3,
    completedTasks: 42,
    totalTasks: 78,
    teamMembers: 5,
    activeSprints: 1,
    progressData: [
      { name: 'Marketing Site', percentage: 65 },
      { name: 'Mobile App', percentage: 32 },
      { name: 'API Service', percentage: 89 }
    ],
    activeSprint: {
      id: 1,
      name: 'Sprint 12',
      goal: 'Complete core features for MVP',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 58,
      totalTasks: 24,
      completedTasks: 14,
      projectId: 1
    }
  };
}

export function generateDummyActivities(count = 5) {
  const actions = [
    'created ticket',
    'completed ticket',
    'commented on',
    'assigned ticket',
    'started working on',
    'reviewed',
    'updated status of'
  ];
  
  const projects = ['MW', 'MA', 'API', 'DB'];
  const users = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Sam Wilson'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    user: users[i % users.length],
    action: actions[i % actions.length],
    project: projects[i % projects.length],
    ticket: `${projects[i % projects.length]}-${Math.floor(Math.random() * 50) + 1}`,
    timestamp: new Date(Date.now() - (i * 2 * 60 * 60 * 1000)).toISOString(),
    avatarUrl: null
  }));
}

export function generateDummyProjects(count = 3) {
  const statuses = ['active', 'active', 'archived'];
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Alex Johnson', email: 'alex@example.com' }
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const owner = users[i % users.length];
    return {
      id: i + 1,
      name: ['Marketing Website', 'Mobile App', 'API Service'][i],
      key: ['MW', 'MA', 'API'][i],
      description: [
        'New company marketing site',
        'iOS and Android application',
        'Backend API service'
      ][i],
      status: statuses[i],
      owner,
      members: [
        owner,
        users[(i + 1) % users.length]
      ],
      sprints: i < 2 ? [{
        id: i + 1,
        name: `Sprint ${i + 10}`,
        status: 'active',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }] : [],
      createdAt: new Date(Date.now() - (i * 5 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
      isDummy: true
    };
  });
}

export function generateDummyTicket(ticketId) {
  const types = ['story', 'bug', 'task'];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const reporter = {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    avatarUrl: null
  };
  
  const assignee = Math.random() > 0.3 ? {
    id: 2,
    name: 'Developer One',
    email: 'dev1@example.com',
    avatarUrl: null
  } : null;
  
  const comments = Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
    id: i + 1,
    content: `This is a sample comment about the ${type} issue. Priority is ${priority}.`,
    user: Math.random() > 0.5 ? reporter : assignee || reporter,
    createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
  }));
  
  return {
    id: ticketId || Math.floor(Math.random() * 1000) + 1,
    title: `${type === 'bug' ? 'Fix' : type === 'story' ? 'Implement' : 'Complete'} ${['header', 'footer', 'login', 'API', 'database'][Math.floor(Math.random() * 5)]} ${type === 'bug' ? 'issue' : 'feature'}`,
    description: `This is a detailed description of the ${type} issue. Priority is ${priority} and it's currently ${status.replace('_', ' ')}.`,
    type,
    status,
    priority,
    storyPoints: [1, 2, 3, 5, 8][Math.floor(Math.random() * 5)],
    projectId: 1,
    sprintId: Math.random() > 0.5 ? 1 : null,
    assignee,
    reporter,
    comments,
    createdAt: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)).toISOString(),
    updatedAt: new Date().toISOString(),
    isDummy: true
  };
}

export function generateDummyBillingReport() {
  const users = [
    { id: 1, name: 'John Developer', rate: 75 },
    { id: 2, name: 'Jane Designer', rate: 65 },
    { id: 3, name: 'Mike QA', rate: 55 },
  ];

  const byUser = users.map(user => ({
    userId: user.id,
    userName: user.name,
    hours: Math.floor(Math.random() * 40) + 10,
    rate: user.rate,
    total: 0
  }));

  // Calculate totals
  byUser.forEach(user => {
    user.total = user.hours * user.rate;
  });

  const totalHours = byUser.reduce((sum, user) => sum + user.hours, 0);
  const totalCost = byUser.reduce((sum, user) => sum + user.total, 0);

  return {
    totalHours,
    totalCost,
    unbilledHours: Math.floor(totalHours * 0.7), // 70% of hours unbilled
    byUser,
    isDummy: true
  };
}