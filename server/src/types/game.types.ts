import { Round } from '../types/round.types';

export interface GameState {
  players: Player[];
  rounds: Round[];
}

export interface Player {
  clientId: string;
  friendlyName: string;
  isHost: boolean;
}

export interface GameCreateData {
  gameId: string;
  photoSet: number;
}

export interface GameCreatedData {
  gameId: string;
  player: Player;
  host: Player;
  photoSet: number;
}

export interface GameStartData {
  gameId: string;
}

export interface GameJoinData {
  gameId: string;
  friendlyName: string;
}

export interface GameJoinedData {
  gameId: string;
  player: Player;
  host: Player;
  currentPlayers: Player[];
}

export interface GameNewPlayerJoinedData {
  player: Player;
}

export interface GameJoinError {
  type: string;
  didOccur: boolean;
}

export interface GameJoinErrorData {
  message: string;
}
