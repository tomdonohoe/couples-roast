import { Server, Socket } from 'socket.io';

import {
  GAME_OVER,
  RESULTS_GAME_END,
  RESULTS_ROUND_END,
  ROUND_BEGIN,
} from '../constants/events.constants';
import { ResultsGameEndData, ResultsRoundEndData } from '../types/result.types';
import { RoundBeginData } from '../types/round.types';

const onResultRoundEnd = (data: ResultsRoundEndData, io: Server) => {
  const { gameId, round, host } = data;

  // tells client to move to next round
  const roundBeginData: RoundBeginData = {
    gameId: gameId,
    round: round + 1,
  };
  console.log(`telling client to start round: ${round + 1}`);
  io.to(host.clientId).emit(ROUND_BEGIN, roundBeginData);
};

const onResultGameEnd = (data: ResultsGameEndData, io: Server) => {
  const { gameId } = data;
  io.to(gameId).emit(GAME_OVER);
};

export const registerResultHandlers = (socket: Socket, io: Server) => {
  socket.on(RESULTS_ROUND_END, (data: ResultsRoundEndData) =>
    onResultRoundEnd(data, io),
  );
  socket.on(RESULTS_GAME_END, (data: ResultsGameEndData) => {
    onResultGameEnd(data, io);
  });
};
