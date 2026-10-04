// Global capabilities applied site-wide
export const GLOBAL_PERMISSIONS = {
  ADMINISTER_SYSTEM: 'ADMINISTER_SYSTEM',
  CREATE_PROJECT: 'CREATE_PROJECT',
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_GROUPS: 'MANAGE_GROUPS',
  MANAGE_ROLES: 'MANAGE_ROLES',
  MANAGE_WORKFLOWS: 'MANAGE_WORKFLOWS',
  MANAGE_PERMISSION_SCHEMES: 'MANAGE_PERMISSION_SCHEMES',
  MANAGE_NOTIFICATIONS: 'MANAGE_NOTIFICATIONS',
  MANAGE_AUTOMATION: 'MANAGE_AUTOMATION',
  VIEW_AUDIT_LOG: 'VIEW_AUDIT_LOG',
  MANAGE_SYSTEM_SETTINGS: 'MANAGE_SYSTEM_SETTINGS',
};

// Granular capabilities scoped to a project workspace
export const PROJECT_PERMISSIONS = {
  // Project Admin
  ADMINISTER_PROJECT: 'ADMINISTER_PROJECT',
  BROWSE_PROJECT: 'BROWSE_PROJECT',
  CREATE_VERSION: 'CREATE_VERSION',
  MANAGE_SPRINT: 'MANAGE_SPRINT',

  // Issue Operations
  CREATE_ISSUE: 'CREATE_ISSUE',
  EDIT_ISSUE: 'EDIT_ISSUE',
  DELETE_ISSUE: 'DELETE_ISSUE',
  ASSIGN_ISSUE: 'ASSIGN_ISSUE',
  TRANSITION_ISSUE: 'TRANSITION_ISSUE',
  COMMENT_ISSUE: 'COMMENT_ISSUE',
  ATTACH_FILES: 'ATTACH_FILES',
};

// Default configurable project roles
export const DEFAULT_PROJECT_ROLES = [
  { id: 'role-sys-admin', name: 'System Administrator', description: 'Complete site control and configuration access' },
  { id: 'role-proj-admin', name: 'Project Administrator', description: 'Manage project settings, components, and versions' },
  { id: 'role-pm', name: 'Project Manager', description: 'Schedule sprints, manage backlogs, and roadmap tracking' },
  { id: 'role-dev', name: 'Developer', description: 'Create and transition issues, branch code, and log work' },
  { id: 'role-qa', name: 'Tester', description: 'File defects, execute test cycles, and verify fixes' },
  { id: 'role-rep', name: 'Reporter', description: 'Log initial issues and track issue progress' },
  { id: 'role-view', name: 'Viewer', description: 'Read-only access to boards, roadmaps, and reports' },
];