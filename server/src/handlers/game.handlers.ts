import { Server, Socket } from 'socket.io';

import { ActiveGames } from '../common/ActiveGames';
import {
  GAME_CREATE,
  GAME_CREATED,
  GAME_JOIN,
  GAME_JOINED,
  GAME_NEW_PLAYER_JOINED,
  GAME_START,
  GAME_STARTED,
} from '../constants/events.constants';
import {
  createPlayer,
  getCurrentPlayersInGame,
  handleGameJoinErrors,
  hasGameJoinErrors,
} from '../helpers/game.helpers';
import {
  GameCreateData,
  GameCreatedData,
  GameJoinData,
  GameJoinedData,
  GameJoinError,
  GameNewPlayerJoinedData,
  GameStartData,
  Player,
} from '../types/game.types';

const createGame = async (
  data: GameCreateData,
  socket: Socket,
  io: Server,
): Promise<void> => {
  const { gameId, friendlyName } = data;

  const player: Player = createPlayer(socket, friendlyName, true);

  // creates and joins room
  await socket.join(gameId);

  const gameCreatedResponse: GameCreatedData = {
    gameId: gameId,
    player: player,
    host: player,
  };

  io.to(player.clientId).emit(GAME_CREATED, gameCreatedResponse);
};

const joinGame = async (
  data: GameJoinData,
  socket: Socket,
  io: Server,
  activeGames: ActiveGames,
): Promise<void> => {
  const { gameId, friendlyName } = data;

  const player: Player = createPlayer(socket, friendlyName, false);

  const hasJoinErrors: GameJoinError = hasGameJoinErrors(
    gameId,
    io,
    activeGames,
  );

  if (hasJoinErrors.didOccur) {
    handleGameJoinErrors(hasJoinErrors, player, io);
    // exit early and don't join the room.
    return;
  }

  await socket.join(gameId);

  const currentPlayers: Player[] = await getCurrentPlayersInGame(io, gameId);
  const host: Player = currentPlayers[0];

  const gameJoinedData: GameJoinedData = {
    gameId: gameId,
    player: player,
    host: host,
    currentPlayers: currentPlayers,
  };

  const newPlayer: GameNewPlayerJoinedData = {
    player: player,
  };

  io.to(player.clientId).emit(GAME_JOINED, gameJoinedData);
  socket.to(gameId).emit(GAME_NEW_PLAYER_JOINED, newPlayer);
};

const onStartGame = (
  data: GameStartData,
  io: Server,
  activeGames: ActiveGames,
) => {
  const { gameId } = data;

  activeGames.setGameIdActive(gameId);

  const gameStartedData: GameStartData = {
    gameId: gameId,
  };

  io.in(gameId).emit(GAME_STARTED, gameStartedData);
};

export const registerGameHandlers = (
  socket: Socket,
  io: Server,
  activeGames: ActiveGames,
) => {
  socket.on(GAME_CREATE, (data: GameCreateData) =>
    createGame(data, socket, io),
  );
  socket.on(GAME_JOIN, (data: GameJoinData) =>
    joinGame(data, socket, io, activeGames),
  );
  socket.on(GAME_START, (data: GameStartData) =>
    onStartGame(data, io, activeGames),
  );
};
