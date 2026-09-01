import { Server, Socket } from "socket.io";
import { getRoom } from "./rooms";
import { canControlPlayback } from "./permission";
import { Participant, Room } from "./models/types";


function validatePlaybackAction(roomId: string, socketId: string, socket: Socket): { room: Room; participant: Participant } | null {
    const room = getRoom(roomId);
    if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return null;
    }
    
    const participant = room.participants.get(socketId);
    if (!participant || !canControlPlayback(participant.role)) {
        socket.emit('error', { message: 'You do not have permission to control playback' });
        return null;
    }
    
    return { room, participant };
}
export function playbackController(io: Server, socket: Socket){
    socket.on('play', ({roomId}: {roomId: string}) => {
        const result = validatePlaybackAction(roomId, socket.id, socket);
        if (!result) return;
    
        const { room } = result;
        room.state.playbackState = 'PLAYING';
        io.to(roomId).emit('sync_state', room.state);
    })
    socket.on('pause', ({roomId}: {roomId: string}) => {
        const result = validatePlaybackAction(roomId, socket.id, socket);
        if (!result) return;

        const { room } = result;
        room.state.playbackState = 'PAUSED';
        io.to(roomId).emit('sync_state', room.state);
    })
    socket.on('seek', ({roomId, time}: {roomId: string, time: number}) => {
        const result = validatePlaybackAction(roomId, socket.id, socket);
        if (!result) return;

        const { room } = result;
        room.state.currentTime = time;
        io.to(roomId).emit('sync_state', {currentTime: time});
    })
    socket.on('change_video', ({roomId, videoId}: {roomId: string, videoId: string}) => {
        const result = validatePlaybackAction(roomId, socket.id, socket);
        if (!result) return;

        const { room } = result;
        room.state.videoId = videoId;
        room.state.currentTime = 0;
        room.state.playbackState = 'PAUSED';
        io.to(roomId).emit('sync_state', {videoId, currentTime: 0, playbackState: 'PAUSED'});
    })
}