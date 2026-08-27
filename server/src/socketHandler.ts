import {Socket, Server} from 'socket.io';
import {Participant} from './models/types';
import {createRoom, getRoom} from './rooms';

export function socketHandler(io: Server, socket: Socket){
    socket.on('create_room', ({username}: {username: string}) => {
        const room = createRoom(socket.id, username);
        socket.join(room.roomId);
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
        io.to(room.roomId).emit('user_joined', {
            userId: socket.id,
            username,
            role: participant.role,
            participants: [...room.participants.values()]
        });
    })
}