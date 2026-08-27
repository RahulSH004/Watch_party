import {nanoid} from 'nanoid';
import {Room , Participant} from './models/types';

const rooms = new Map<string, Room>();

export function createRoom(hostSocketId: string, hostUername: string): Room{
    const roomId = nanoid(8);
    const host: Participant ={
        userId: hostSocketId,
        username: hostUername,
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