import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';

import { CONNECTION } from './constants/events.constants';
import { registerGameHandlers } from './handlers/game.handlers';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../..', 'client/dist')));
app.use(express.static(__dirname + '/public'));

const onConnection = (socket: Socket): void => {
  registerGameHandlers(socket, io);
};

io.on(CONNECTION, onConnection);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
