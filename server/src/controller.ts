import { Server, Socket } from "socket.io";
import { getRoom } from "./rooms";
import { canControlPlayback } from "./permission";

export function playbackController(io: Server, socket: Socket){
    socket.on('play', ({roomId}: {roomId: string}) => {
        const room = getRoom(roomId);
        if(!room){
            socket.emit('error', {message: 'Room not found'});
            return;
        }
        const participant = room.participants.get(socket.id);
        if(!participant || !canControlPlayback(participant.role)){
            socket.emit('error', {message: 'You do not have permission to control playback'});
            return;
        }
        room.state.playbackState = 'PLAYING';
        io.to(roomId).emit('playback_state_changed', {playbackState: 'PLAYING'});
    })
    socket.on('pause', ({roomId}: {roomId: string}) => {
        const room = getRoom(roomId);
        if(!room){
            socket.emit('error', {message: 'Room not found'});
            return;
        }
        const participant = room.participants.get(socket.id);
        if(!participant || !canControlPlayback(participant.role)){
            socket.emit('error', {message: 'You do not have permission to control playback'});
            return;
        }
        room.state.playbackState = 'PAUSED';
        io.to(roomId).emit('playback_state_changed', {playbackState: 'PAUSED'});
    })
    socket.on('seek', ({roomId, time}: {roomId: string, time: number}) => {
        const room = getRoom(roomId);
        if(!room){
            socket.emit('error', {message: 'Room not found'});
            return;
        }
        const participant = room.participants.get(socket.id);
        if(!participant || !canControlPlayback(participant.role)){
            socket.emit('error', {message: 'You do not have permission to control playback'});
            return;
        }
        room.state.currentTime = time;
        io.to(roomId).emit('playback_time_changed', {currentTime: time});
    })
    socket.on('change_video', ({roomId, videoId}: {roomId: string, videoId: string}) => {
        const room = getRoom(roomId);
        if(!room){
            socket.emit('error', {message: 'Room not found'});
            return;
        }
        const participant = room.participants.get(socket.id);
        if(!participant || !canControlPlayback(participant.role)){
            socket.emit('error', {message: 'You do not have permission to control playback'});
            return;
        }
        room.state.videoId = videoId;
        room.state.currentTime = 0;
        room.state.playbackState = 'PAUSED';
        io.to(roomId).emit('video_changed', {videoId, currentTime: 0, playbackState: 'PAUSED'});
    })
}