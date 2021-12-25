import { Server, Socket } from 'socket.io';

import {
  RESULTS_ROUND,
  VOTING_END,
  VOTING_PLAYER_VOTE,
  VOTING_SUBMITTED_PLAYER_VOTE,
} from '../constants/events.constants';
import { VotingEndedData, VotingPlayerVote } from '../types/voting.types';

const onPlayerSubmittedVote = (data: VotingPlayerVote, io: Server) => {
  const { host } = data;

  io.to(host.clientId).emit(VOTING_SUBMITTED_PLAYER_VOTE, data);
};

const onVotingEnded = (data: VotingEndedData, io: Server) => {
  const { gameId } = data;
  io.to(gameId).emit(RESULTS_ROUND, data);
};

export const registerVoteHandlers = (socket: Socket, io: Server) => {
  socket.on(VOTING_PLAYER_VOTE, (data: VotingPlayerVote) => {
    onPlayerSubmittedVote(data, io);
  });
  socket.on(VOTING_END, (data: VotingEndedData) => onVotingEnded(data, io));
};
