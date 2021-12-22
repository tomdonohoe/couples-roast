import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../..', 'client/dist')));
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
