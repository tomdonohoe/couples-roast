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

  public waitUntil(condition: () => boolean, timeout: number) {
    return new Promise(
      (res: (value: string) => void, rej: (reason: string) => void) => {
        if (condition()) {
          console.log('condition met!');
          res('condition met!');
          return;
        }

        let elapsed = 0;
        const pollFrequency = 10;
        const poll = setInterval(() => {
          console.log('polling!');
          if (condition()) {
            console.log('condition met!');
            clearInterval(poll);
            res('condition met!');
            return;
          }

          elapsed += pollFrequency;

          if (!timeout) {
            return;
          }

          if (elapsed >= timeout) {
            console.log('time out');
            clearInterval(poll);
            rej('Timed out');
          }
        }, pollFrequency);
      },
    );
  }
}
