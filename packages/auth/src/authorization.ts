export interface AuthContext {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  organizationId: string;
  departmentId?: string;
}

export function canAccessResource(
  context: AuthContext,
  requiredPermission: string,
  organizationId: string,
  departmentId?: string
): boolean {
  // Platform owner has all permissions
  if (context.role === 'PLATFORM_OWNER') {
    return true;
  }

  // Organization isolation
  if (context.organizationId !== organizationId) {
    return false;
  }

  // Department-specific resources
  if (departmentId && context.departmentId !== departmentId) {
    // Check if user has cross-department permission
    if (!context.permissions.includes(`${requiredPermission}:cross_department`)) {
      return false;
    }
  }

  // Check permission
  return context.permissions.includes(requiredPermission);
}

export function canManageUser(
  context: AuthContext,
  targetUserId: string,
  targetOrganizationId: string,
  targetRole: string
): boolean {
  // Can't promote to a higher role
  const roleHierarchy: Record<string, number> = {
    CITIZEN: 0,
    FIELD_WORKER: 1,
    OPERATOR: 2,
    DISPATCHER: 3,
    DEPARTMENT_MANAGER: 4,
    MUNICIPALITY_ADMIN: 5,
    SUPER_ADMIN: 6,
    PLATFORM_OWNER: 7,
  };

  const contextRoleLevel = roleHierarchy[context.role] || -1;
  const targetRoleLevel = roleHierarchy[targetRole] || -1;

  if (targetRoleLevel > contextRoleLevel) {
    return false;
  }

  // Organization isolation
  if (context.organizationId !== targetOrganizationId) {
    if (context.role !== 'PLATFORM_OWNER') {
      return false;
    }
  }

  return context.permissions.includes('users:manage');
}
