import {nanoid} from 'nanoid';
import {Room , Participant} from './models/types';

const rooms = new Map<string, Room>();

export function createRoom(hostSocketId: string, hostUsername: string): Room{
    const roomId = nanoid(8);
    const host: Participant ={
        userId: hostSocketId,
        username: hostUsername,
        role: 'HOST'
    }
    const room: Room = {
        roomId,
        hostId: hostSocketId,
        participants: new Map([[hostSocketId, host]]),
        state: {
            videoId: null,
            currentTime: 0,
            playbackState: 'PAUSED'
        }
    }
    rooms.set(roomId, room);
    return room;
}
export function getRoom(roomId: string): Room | null{
    return rooms.get(roomId) ?? null;
}

export function remvoeParticipant(roomId: string, userId: string): Room | null{
    const room = rooms.get(roomId);
    if(!room){
        return null;
    }
    room.participants.delete(userId);
    if(room.hostId === userId){
        room.hostId = null;
    }
    if(room.participants.size === 0){
        rooms.delete(roomId);
        return null;
    }
    return room;
}

export function deleteRoom(roomId: string): boolean{
    rooms.delete(roomId);
    return true;
}