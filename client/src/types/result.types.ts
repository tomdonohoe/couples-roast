import { Player } from './game.types';

export interface ResultsRoundEndData {
  gameId: string;
  round: number;
  host: Player;
}

export interface GameResults {
  player: Player;
  points: number;
}
