import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import { socketHandler } from './src/socketHandler';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin: ['http://localhost:5173'],
    }
});

io.on('connection', (socket) => {
    console.log('user is connected');
    socketHandler(io, socket);

    socket.on('disconnect', () => {
        console.log('user is disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
