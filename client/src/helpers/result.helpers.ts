import { sortResultsDescending } from '../helpers/common.helpers';
import { Player } from '../types/game.types';
import { GameResults } from '../types/result.types';
import { Round } from '../types/round.types';

export const calculateGameLeaderboard = (
  rounds: Round[],
  players: Player[],
): GameResults[] => {
  const gameResults: GameResults[] = [];
  // for each player
  for (const player of players) {
    let playerTotalPoints = 0;

    // for each round
    for (const round of rounds) {
      // calculate total points for player
      const roundPoints = round.results.filter(
        (result) => result.player.clientId === player.clientId,
      )[0].points;
      playerTotalPoints += roundPoints;
    }

    // add to game results
    gameResults.push({
      player: player,
      points: playerTotalPoints,
    });
  }

  // sort leaderboard descending
  const leaderboard = sortResultsDescending(gameResults);

  return leaderboard;
};
