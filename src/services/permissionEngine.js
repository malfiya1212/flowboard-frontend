import { GLOBAL_PERMISSIONS, PROJECT_PERMISSIONS } from '../utils/permissionConstants';

export const permissionEngine = {
  /**
   * Evaluates Global Permissions across the site
   * @param {Object} user - The authenticated user object
   * @param {string} permission - GLOBAL_PERMISSIONS key
   * @param {Array} globalGrants - Array of { permission, grantedTo: { type: 'group'|'user', id } }
   */
  hasGlobalPermission: (user, permission, globalGrants = []) => {
    if (!user) return false;

    // Check if user has global super-admin clearance
    const isSuperAdmin = globalGrants.some(
      (grant) =>
        grant.permission === GLOBAL_PERMISSIONS.ADMINISTER_SYSTEM &&
        grantMatchesUser(grant, user)
    );
    if (isSuperAdmin) return true;

    // Evaluate target permission
    return globalGrants.some(
      (grant) => grant.permission === permission && grantMatchesUser(grant, user)
    );
  },

  /**
   * Evaluates Project-Level Permissions using Permission Schemes & Project Role Assignments
   * @param {Object} user - The authenticated user object
   * @param {string} permission - PROJECT_PERMISSIONS key
   * @param {Object} project - The project containing permissionScheme & roleAssignments
   * @param {Object} permissionScheme - The scheme defining which roles/groups have this permission
   */
  hasProjectPermission: (user, permission, project, permissionScheme) => {
    if (!user || !project || !permissionScheme) return false;

    // 1. Site Administrators inherit all project permissions
    if (user.groups?.includes('jira-administrators')) return true;

    // 2. Project Admins inherit all permissions inside their project
    const projectAdminRole = 'role-proj-admin';
    const isProjectAdmin = project.roleAssignments?.[projectAdminRole]?.some(
      (assigneeId) =>
        assigneeId === user.id || user.groups?.includes(assigneeId)
    );
    if (isProjectAdmin) return true;

    // 3. Evaluate specific grant rules in the Project's Permission Scheme
    const matchingGrants = permissionScheme.grants?.filter(
      (g) => g.permission === permission
    ) || [];

    return matchingGrants.some((grant) => {
      // Grant by Project Role (e.g., 'role-dev')
      if (grant.type === 'project_role') {
        const assignedEntities = project.roleAssignments?.[grant.targetId] || [];
        return assignedEntities.some(
          (entityId) => entityId === user.id || user.groups?.includes(entityId)
        );
      }

      // Grant by Group (e.g., 'flowboard-developers')
      if (grant.type === 'group') {
        return user.groups?.includes(grant.targetId);
      }

      // Grant by Direct User Assignment
      if (grant.type === 'user') {
        return user.id === grant.targetId;
      }

      return false;
    });
  },
};

// Helper: Checks if a global grant matches the user's ID or group memberships
function grantMatchesUser(grant, user) {
  if (grant.type === 'user' && grant.targetId === user.id) return true;
  if (grant.type === 'group' && user.groups?.includes(grant.targetId)) return true;
  return false;
}