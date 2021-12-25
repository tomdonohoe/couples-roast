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
