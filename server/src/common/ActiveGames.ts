export class ActiveGames {
  private activeGames: Map<string, boolean>;

  constructor() {
    this.activeGames = new Map();
  }

  public isGameIdActive(gameId: string): boolean {
    const isGameActive = this.activeGames.get(gameId);
    console.log('isGameIdActive: ');
    console.log(isGameActive);

    if (isGameActive) {
      return true;
    }

    return false;
  }

  public setGameIdActive(gameId: string): void {
    this.activeGames.set(gameId, true);
  }

  public deleteGameId(gameId: string): void {
    this.activeGames.delete(gameId);
  }
}
