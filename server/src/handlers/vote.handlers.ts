import { Server, Socket } from 'socket.io';

import {
  VOTING_END,
  VOTING_PLAYER_VOTE,
  VOTING_SUBMITTED_PLAYER_VOTE,
} from '../constants/events.constants';
import { VotingPlayerVote } from '../types/voting.types';

const onPlayerSubmittedVote = (data: VotingPlayerVote, io: Server) => {
  const { host } = data;

  io.to(host.clientId).emit(VOTING_SUBMITTED_PLAYER_VOTE, data);
};

const onVotingEnded = (data: any) => {
  console.log(data);
  console.log(data.gameState.rounds[0].results);
};

export const registerVoteHandlers = (socket: Socket, io: Server) => {
  socket.on(VOTING_PLAYER_VOTE, (data: VotingPlayerVote) => {
    onPlayerSubmittedVote(data, io);
  });
  socket.on(VOTING_END, onVotingEnded);
};
