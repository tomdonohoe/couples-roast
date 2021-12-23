import { Server, Socket } from 'socket.io';

import {
  GAME_CREATE,
  GAME_CREATED,
  GAME_START,
  GAME_STARTED,
} from '../constants/events.constants';
import {
  GameCreateData,
  GameCreatedData,
  GameStartData,
  Player,
} from '../types/game.types';

const createGame = async (
  data: GameCreateData,
  socket: Socket,
): Promise<void> => {
  const { gameId, friendlyName } = data;

  const player: Player = {
    clientId: socket.id,
    friendlyName: friendlyName,
    isHost: true,
  };

  socket.data.player = player;

  await socket.join(gameId);

  const gameCreatedResponse: GameCreatedData = {
    gameId: gameId,
    player: player,
    host: player,
  };

  socket.emit(GAME_CREATED, gameCreatedResponse);
};

const onStartGame = (data: GameStartData, io: Server) => {
  const { gameId } = data;

  // TODO: prevent others from joining the room.

  const gameStartedData: GameStartData = {
    gameId: gameId,
  };

  io.in(gameId).emit(GAME_STARTED, gameStartedData);
};

export const registerGameHandlers = (socket: Socket, io: Server) => {
  socket.on(GAME_CREATE, (data: GameCreateData) => createGame(data, socket));
  socket.on(GAME_START, (data: GameStartData) => onStartGame(data, io));
};
