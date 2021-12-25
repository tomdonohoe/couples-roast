import { Server, Socket } from 'socket.io';

import {
  GAME_BEGIN_ROUNDS,
  ROUND_BEGIN,
  ROUND_ENDED,
  ROUND_PLAYER_CAPTION,
  ROUND_START,
  ROUND_STARTED,
  ROUND_SUBMITTED_PLAYER_CAPTION,
  VOTING_START,
} from '../constants/events.constants';
import {
  BeginRoundsData,
  RoundBeginData,
  RoundEndedData,
  RoundPlayerCaption,
  RoundStartData,
} from '../types/round.types';

const onGameBeginRounds = (data: BeginRoundsData, io: Server) => {
  const { host, gameId } = data;
  const roundBeginData: RoundBeginData = {
    gameId: gameId,
  };

  io.to(host.clientId).emit(ROUND_BEGIN, roundBeginData);
};

const onRoundStart = (data: RoundStartData, io: Server) => {
  const { gameId } = data;
  io.to(gameId).emit(ROUND_STARTED, data);
};

const onRoundPlayerCaption = (data: RoundPlayerCaption, io: Server) => {
  const { host } = data;
  io.to(host.clientId).emit(ROUND_SUBMITTED_PLAYER_CAPTION, data);
};

const onRoundEnded = (data: RoundEndedData, io: Server) => {
  const { gameId } = data;
  console.log('round ended');
  io.to(gameId).emit(VOTING_START, data);
};

export const registerRoundHandlers = (socket: Socket, io: Server) => {
  socket.on(GAME_BEGIN_ROUNDS, (data: BeginRoundsData) => {
    onGameBeginRounds(data, io);
  });
  socket.on(ROUND_START, (data: RoundStartData) => {
    onRoundStart(data, io);
  });
  socket.on(ROUND_PLAYER_CAPTION, (data: RoundPlayerCaption) => {
    onRoundPlayerCaption(data, io);
  });
  socket.on(ROUND_ENDED, (data: RoundEndedData) => {
    onRoundEnded(data, io);
  });
};
