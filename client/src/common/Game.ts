import { GameState, Player } from '../types/game.types';

export class Game {
  private gameId: string;
  private player: Player;
  private host: Player;
  private gameState: GameState;

  constructor() {
    this.gameState = {
      players: [],
      rounds: [],
    };
  }

  public getGameId(): string {
    return this.gameId;
  }

  public setGameId(gameId: string): void {
    this.gameId = gameId;
  }

  public getPlayer(): Player {
    return this.player;
  }

  public setPlayer(player: Player): void {
    this.player = player;
  }

  public getHost(): Player {
    return this.host;
  }

  public setHost(host: Player): void {
    this.host = host;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public setGameState(gameState: GameState): void {
    this.gameState = gameState;
  }
}
