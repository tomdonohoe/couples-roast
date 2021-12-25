import { Photo } from './api.types';
import { GameState, Player } from './game.types';

export interface Round {
  number: number;
  photo: Photo;
  captions: SubmittedPlayerCaption[];
}

export interface RoundBeginData {
  gameId: string;
}

export interface RoundStartData {
  gameId: string;
  round: number;
  photo: Photo;
  gameState: GameState;
}

export interface RoundPlayerCaption {
  gameId: string;
  round: number;
  player: Player;
  host: Player;
  caption: string;
}

export interface SubmittedPlayerCaption {
  player: Player;
  caption: string;
}

export interface RoundEndedData {
  gameId: string;
  round: number;
  gameState: GameState;
}
