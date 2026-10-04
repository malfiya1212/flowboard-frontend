import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  // 1. Projects Store
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('flowboard_projects');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'proj-flw',
        key: 'FLW',
        name: 'FlowBoard Core App',
        description: 'Next-generation Agile management platform for engineering teams.',
        template: 'Scrum',
        projectType: 'company-managed',
        lead: 'Malefiya',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'proj-api',
        key: 'API',
        name: 'Cloud REST Gateway',
        description: 'High-throughput edge routing microservices and proxy nodes.',
        template: 'Kanban',
        projectType: 'team-managed',
        lead: 'Sarah Smith',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // 2. Sprints Store (Scrum Engine)
  const [sprints, setSprints] = useState(() => {
    const saved = localStorage.getItem('flowboard_sprints');
    if (saved) return JSON.parse(saved);
    const now = Date.now();
    return [
      {
        id: 'sprint-1',
        projectId: 'FLW',
        name: 'FLW Sprint 1',
        goal: 'Core Workspace Layout & Agile Transition Logic',
        status: 'active', // 'future' | 'active' | 'closed'
        startDate: new Date(now - 3 * 86400000).toISOString(),
        endDate: new Date(now + 11 * 86400000).toISOString(),
      },
      {
        id: 'sprint-2',
        projectId: 'FLW',
        name: 'FLW Sprint 2',
        goal: 'RBAC Permission Schemes & Audit Pipeline',
        status: 'future',
        startDate: new Date(now + 12 * 86400000).toISOString(),
        endDate: new Date(now + 26 * 86400000).toISOString(),
      },
    ];
  });

  // 3. Kanban Columns Store (with WIP Limits)
  const [kanbanColumns, setKanbanColumns] = useState(() => {
    const saved = localStorage.getItem('flowboard_kanban_columns');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'col-todo', name: 'To Do', category: 'To Do', wipLimit: 0 },
      { id: 'col-progress', name: 'In Progress', category: 'In Progress', wipLimit: 3 },
      { id: 'col-review', name: 'In Review', category: 'In Progress', wipLimit: 2 },
      { id: 'col-done', name: 'Done', category: 'Done', wipLimit: 0 },
    ];
  });

  // 4. Issues Store
  const [issues, setIssues] = useState(() => {
    const saved = localStorage.getItem('flowboard_issues');
    if (saved) return JSON.parse(saved);
    const now = Date.now();
    return [
      {
        id: 'iss-1',
        key: 'FLW-1',
        projectKey: 'FLW',
        title: 'Implement dynamic sprint planning backlog',
        type: 'Story',
        priority: 'High',
        status: 'In Progress',
        assignee: 'Malefiya',
        storyPoints: 5,
        sprintId: 'sprint-1',
        epic: 'Frontend Core',
        dueDate: new Date(now + 4 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(now - 2 * 86400000).toISOString(),
      },
      {
        id: 'iss-2',
        key: 'FLW-2',
        projectKey: 'FLW',
        title: 'Configure WIP Limit warning alerts on Kanban cards',
        type: 'Task',
        priority: 'Medium',
        status: 'To Do',
        assignee: 'Sarah Smith',
        storyPoints: 3,
        sprintId: 'sprint-1',
        epic: 'Kanban Engine',
        dueDate: new Date(now + 6 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(now - 1 * 86400000).toISOString(),
      },
      {
        id: 'iss-3',
        key: 'FLW-3',
        projectKey: 'FLW',
        title: 'Fix token rotation 401 interceptor loop in auth client',
        type: 'Bug',
        priority: 'Highest',
        status: 'Done',
        assignee: 'John Doe',
        storyPoints: 2,
        sprintId: 'sprint-1',
        epic: 'Security Gateways',
        dueDate: new Date(now - 1 * 86400000).toISOString().split('T')[0],
        createdAt: new Date(now - 3 * 86400000).toISOString(),
      },
      {
        id: 'iss-4',
        key: 'FLW-4',
        projectKey: 'FLW',
        title: 'Design Swimlane grouping toggle by priority & assignee',
        type: 'Story',
        priority: 'Medium',
        status: 'To Do',
        assignee: 'Malefiya',
        storyPoints: 8,
        sprintId: null, // In Backlog
        epic: 'Kanban Engine',
        dueDate: new Date(now + 12 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'iss-5',
        key: 'API-1',
        projectKey: 'API',
        title: 'Implement rate-limiting middleware for token refresh route',
        type: 'Task',
        priority: 'High',
        status: 'In Progress',
        assignee: 'Sarah Smith',
        storyPoints: 3,
        sprintId: null,
        epic: 'Security Gateways',
        dueDate: new Date(now + 3 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      },
    ];
  });

  // 5. Releases / Versions Store
  const [releases, setReleases] = useState(() => {
    const saved = localStorage.getItem('flowboard_releases');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rel-1',
        projectKey: 'FLW',
        name: 'Version 1.0.0-RC',
        description: 'Initial Release Candidate including Scrum and Kanban boards',
        releaseDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: 'Unreleased', // 'Unreleased' | 'Released' | 'Archived'
      },
    ];
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('flowboard_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('flowboard_sprints', JSON.stringify(sprints));
  }, [sprints]);

  useEffect(() => {
    localStorage.setItem('flowboard_kanban_columns', JSON.stringify(kanbanColumns));
  }, [kanbanColumns]);

  useEffect(() => {
    localStorage.setItem('flowboard_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('flowboard_releases', JSON.stringify(releases));
  }, [releases]);

  // --- ACTIONS & ENGINE OPERATIONS ---

  // Issue Operations
  const createIssue = (data) => {
    const projectIssues = issues.filter((i) => i.projectKey === data.projectKey);
    const nextNumber = projectIssues.length + 1;
    const newIssue = {
      id: `iss-${Date.now()}`,
      key: `${data.projectKey}-${nextNumber}`,
      title: data.title,
      type: data.type || 'Story',
      priority: data.priority || 'Medium',
      status: data.status || 'To Do',
      assignee: data.assignee || 'Unassigned',
      storyPoints: Number(data.storyPoints) || 1,
      sprintId: data.sprintId || null,
      epic: data.epic || 'General',
      dueDate: data.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      projectKey: data.projectKey,
      createdAt: new Date().toISOString(),
    };
    setIssues((prev) => [newIssue, ...prev]);
    return newIssue;
  };

  const updateIssue = (id, updates) => {
    setIssues((prev) => prev.map((iss) => (iss.id === id ? { ...iss, ...updates } : iss)));
  };

  const transitionIssue = (id, newStatus) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, status: newStatus } : iss))
    );
  };

  const deleteIssue = (id) => {
    setIssues((prev) => prev.filter((iss) => iss.id !== id));
  };

  // Scrum Operations
  const createSprint = (projectKey, name, goal) => {
    const projectSprints = sprints.filter((s) => s.projectId === projectKey);
    const newSprint = {
      id: `sprint-${Date.now()}`,
      projectId: projectKey,
      name: name || `${projectKey} Sprint ${projectSprints.length + 1}`,
      goal: goal || 'Deliver scheduled sprint backlog items.',
      status: 'future',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    };
    setSprints((prev) => [...prev, newSprint]);
  };

  const startSprint = (sprintId, durationDays = 14) => {
    const now = Date.now();
    setSprints((prev) =>
      prev.map((s) => {
        if (s.id === sprintId) {
          return {
            ...s,
            status: 'active',
            startDate: new Date(now).toISOString(),
            endDate: new Date(now + durationDays * 86400000).toISOString(),
          };
        }
        return s;
      })
    );
  };

  const completeSprint = (sprintId) => {
    // 1. Mark sprint as closed
    setSprints((prev) =>
      prev.map((s) => (s.id === sprintId ? { ...s, status: 'closed' } : s))
    );
    // 2. Move incomplete issues back to backlog (sprintId = null)
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.sprintId === sprintId && iss.status !== 'Done') {
          return { ...iss, sprintId: null };
        }
        return iss;
      })
    );
  };

  const moveIssueToSprint = (issueId, targetSprintId) => {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, sprintId: targetSprintId } : iss))
    );
  };

  // Kanban Operations
  const updateColumnWipLimit = (columnId, limit) => {
    setKanbanColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, wipLimit: Number(limit) } : col))
    );
  };

  // Release Operations
  const createRelease = (data) => {
    const newRel = {
      id: `rel-${Date.now()}`,
      projectKey: data.projectKey,
      name: data.name,
      description: data.description,
      releaseDate: data.releaseDate,
      status: 'Unreleased',
    };
    setReleases((prev) => [...prev, newRel]);
  };

  const toggleReleaseStatus = (id) => {
    setReleases((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'Unreleased' ? 'Released' : 'Unreleased' } : r
      )
    );
  };

  return (
    <WorkspaceContext.Provider
      value={{
        projects,
        issues,
        sprints,
        kanbanColumns,
        releases,
        createIssue,
        updateIssue,
        transitionIssue,
        deleteIssue,
        createSprint,
        startSprint,
        completeSprint,
        moveIssueToSprint,
        updateColumnWipLimit,
        createRelease,
        toggleReleaseStatus,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
}