import { Player } from './game.types';
import { Round } from './round.types';

export interface VotingPlayerVote {
  gameId: string;
  round: Round;
  player: Player;
  host: Player;
  vote: PlayerVote;
}

export interface PlayerVote {
  playerVoteFor: PlayerVote;
}
