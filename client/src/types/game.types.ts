export interface Player {
  clientId: string;
  friendlyName: string;
  isHost: boolean;
}

export interface GameCreateData {
  gameId: string;
  friendlyName: string;
}

export interface GameCreatedData {
  gameId: string;
  player: Player;
  host: Player;
}

export interface GameStartData {
  gameId: string;
}

export interface GameState {
  players: Player[];
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

export interface GameJoinErrorData {
  message: string;
}
