import { Role }  from './models/types'; 

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  HOST: ['playback', 'manage_room'],
  MODERATOR: ['playback'],
  PARTICIPANT: []
};

export function hasPermission(role: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getPermissions(role: Role): string[] {
  return ROLE_PERMISSIONS[role];
}