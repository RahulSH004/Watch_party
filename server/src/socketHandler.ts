import {Socket, Server} from 'socket.io';
import {Participant} from './models/types';
import {createRoom, deleteRoom, getRoom, remvoeParticipant} from './rooms';
import { canManageRoom } from './permission';

export function socketHandler(io: Server, socket: Socket){
    socket.on('create_room', ({username}: {username: string}) => {
        const room = createRoom(socket.id, username);
        socket.join(room.roomId);
        socket.data.roomId = room.roomId;
        socket.emit('room_created', 
            {
                roomId: room.roomId,
                hostId: room.hostId,
                participants: [...room.participants.values()],
                state: room.state
            });
    })
    socket.on('join_room', ({roomId, username}: {roomId: string, username: string}) => {
        const room = getRoom(roomId);
        if(!room){
            socket.emit('error', {message: 'Room not found'});
            return;
        }
        const participant : Participant = {
            userId: socket.id,
            username,
            role: 'PARTICIPANT'
        }
        room.participants.set(socket.id, participant);
        socket.join(room.roomId);
        socket.data.roomId = room.roomId;
        io.to(room.roomId).emit('user_joined', {
            userId: socket.id,
            username,
            role: participant.role,
            participants: [...room.participants.values()]
        });
    })
    socket.on('leave_room', ({roomId}: {roomId: string}) => {
        const updateRoom = remvoeParticipant(roomId,socket.id)
        socket.leave(roomId);
        socket.data.roomId = null;
        if(updateRoom){
            io.to(roomId).emit('user_left', {
                userId: socket.id,
                participants: [...updateRoom.participants.values()],
                hostId: updateRoom.hostId
            })
        }
    })
    socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    if (!roomId) return;  // user kisi room mein tha hi nahi
  
    const updatedRoom = remvoeParticipant(roomId, socket.id);
  
    if (updatedRoom) {
    io.to(roomId).emit('user_left', {
        userId: socket.id,
        participants: [...updatedRoom.participants.values()],
        hostId: updatedRoom.hostId
        });
        }
    });
    socket.on('close_room', ({roomId}: {roomId: string}) => {
        const room = getRoom(roomId);
        if(!room){
            socket.emit('error', {message: 'Room not found'});
            return;
        }
        const participant = room.participants.get(socket.id);
        if(!participant || !canManageRoom(participant.role)){
            socket.emit('error', {message: 'Only host can close the room'});
            return;
        }
        io.to(roomId).emit('room_closed', {message: "'Host has ended the party"});
        deleteRoom(roomId);
    })
}