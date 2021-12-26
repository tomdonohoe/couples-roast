import { GameState } from '../types/game.types';
import { Photo } from './api.types';
import { Player } from './game.types';

export interface Round {
  number: number;
  photo: Photo;
}

export interface BeginRoundsData {
  gameId: string;
  host: Player;
}

export interface RoundBeginData {
  gameId: string;
  round: number;
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

export interface RoundEndedData {
  gameId: string;
  round: number;
  gameState: GameState;
}
