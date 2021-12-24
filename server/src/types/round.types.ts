import { Player } from './game.types';
import { Photo } from './api.types';
import { GameState } from '../types/game.types';

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
    photo: Photo;
    gameState: GameState;
}
