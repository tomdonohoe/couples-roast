import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';

import { pexelsGetPhotoById } from './api/controllers/pexels.controllers';
import { ActiveGames } from './common/ActiveGames';
import { CONNECTION } from './constants/events.constants';
import { registerGameHandlers } from './handlers/game.handlers';
import { registerResultHandlers } from './handlers/result.handlers';
import { registerRoundHandlers } from './handlers/round.handlers';
import { registerVoteHandlers } from './handlers/vote.handlers';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const activeGames: ActiveGames = new ActiveGames();

app.use(express.static(path.join(__dirname, '../..', 'client/dist')));
app.use(express.static(__dirname + '/public'));

const onConnection = (socket: Socket): void => {
  registerGameHandlers(socket, io, activeGames);
  registerRoundHandlers(socket, io);
  registerVoteHandlers(socket, io);
  registerResultHandlers(socket, io);
};

io.on(CONNECTION, onConnection);

app.use('/api/pexels/photo/:id', pexelsGetPhotoById);

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
