import { Server, Socket } from 'socket.io';

import {
  GAME_BEGIN_ROUNDS,
  ROUND_BEGIN,
  ROUND_START,
} from '../constants/events.constants';
import {
    BeginRoundsData,
    RoundBeginData,
    RoundStartData,
} from '../types/round.types';

const onGameBeginRounds = (data: BeginRoundsData, io: Server) => {
  const { host, gameId } = data;
  const roundBeginData: RoundBeginData = {
      gameId: gameId,
  }

  io.to(host.clientId).emit(ROUND_BEGIN, roundBeginData);
};

const onRoundStart = (data: RoundStartData, io: Server) => {
    const { gameId } = data;

    console.log(data);
    
    // EMIT ROUND_STARTED 
    // io.to(gameId).emit();
  };

export const registerRoundHandlers = (
  socket: Socket,
  io: Server,
) => {
  socket.on(GAME_BEGIN_ROUNDS, (data: BeginRoundsData) => {
    onGameBeginRounds(data, io)
  });
  socket.on(ROUND_START, (data: RoundStartData) => {
    onRoundStart(data, io)
  });
};
