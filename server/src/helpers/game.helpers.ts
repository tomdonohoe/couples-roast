import { Server, Socket } from 'socket.io';

import { ActiveGames } from '../common/ActiveGames';
import {
  GAME_ALREADY_STARTED,
  GAME_FULL,
  GAME_JOIN_NO_ERRORS,
} from '../constants/events.constants';
import {
  GAME_FULL_MESSAGE,
  GAME_STARTED_MESSAGE,
  MAX_GAME_ROOM_SIZE,
} from '../constants/game.constants';
import { GameJoinError, GameJoinErrorData, Player } from '../types/game.types';

export const createPlayer = (
  socket: Socket,
  friendlyName: string,
  isHost: boolean,
): Player => {
  const player: Player = {
    clientId: socket.id,
    friendlyName: friendlyName,
    isHost: isHost,
  };

  socket.data.player = player;

  return player;
};

export const getCurrentPlayersInGame = async (
  io: Server,
  gameId: string,
): Promise<Player[]> => {
  const playersInRoom = await io.in(gameId).fetchSockets();

  return playersInRoom.map((socket) => socket.data.player);
};

export const isGameRoomFull = (io: Server, gameId: string): boolean => {
  const gameRoom = io.of('/').adapter.rooms.get(gameId);

  if (gameRoom.size === MAX_GAME_ROOM_SIZE) {
    return true;
  } else {
    return false;
  }
};

export const hasGameJoinErrors = (
  gameId: string,
  io: Server,
  activeGames: ActiveGames,
): GameJoinError => {
  const IsGameFull = isGameRoomFull(io, gameId);
  const isGameStarted = activeGames.isGameIdActive(gameId);

  if (IsGameFull) {
    return {
      type: GAME_FULL,
      didOccur: true,
    };
  } else if (isGameStarted) {
    return {
      type: GAME_ALREADY_STARTED,
      didOccur: true,
    };
  } else {
    return {
      type: GAME_JOIN_NO_ERRORS,
      didOccur: false,
    };
  }
};

const sendGameJoinErrorToPlayer = (
  emitEvent: string,
  errorMessage: string,
  io: Server,
  player: Player,
): void => {
  const message: GameJoinErrorData = {
    message: errorMessage,
  };

  io.to(player.clientId).emit(emitEvent, message);
};

export const handleGameJoinErrors = (
  error: GameJoinError,
  player: Player,
  io: Server,
): void => {
  switch (error.type) {
    case GAME_FULL:
      sendGameJoinErrorToPlayer(GAME_FULL, GAME_FULL_MESSAGE, io, player);
      break;
    case GAME_ALREADY_STARTED:
      sendGameJoinErrorToPlayer(
        GAME_ALREADY_STARTED,
        GAME_STARTED_MESSAGE,
        io,
        player,
      );
      break;
  }
};
