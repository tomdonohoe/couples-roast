import { Photo } from "./api.types";
import { GameState } from "./game.types";

export interface Round {
    number: number;
    photo: Photo;
}

export interface RoundBeginData {
    gameId: string;
}

export interface RoundStartData {
    gameId: string;
    photo: Photo;
    gameState: GameState;
}