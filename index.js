import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const ROOM = 'chatroom';

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);
    socket.on('joinRoom', async (username) => {
        console.log(`User ${username} joined the room`);
        await socket.join(ROOM);

        socket.to(ROOM).emit('roomNotice', `${username} was joined the room`);

        socket.on('chatMessage', (msg) => {
            
            io.to(ROOM).emit('chatMessage', msg);
            console.log( "Message", msg);
        });

        socket.on('typing', (username) => {
            socket.to(ROOM).emit('typing', username);
        });
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});