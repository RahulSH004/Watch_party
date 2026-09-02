import { Role }  from '../models/types'; 

export function canControlPlayback(role: Role): boolean {
    return role === 'HOST' || role === 'MODERATOR';
}

export function canManageRoom(role: Role): boolean {
    return role === 'HOST';
}