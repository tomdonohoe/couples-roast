import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { VOTING_END } from '../../../constants/event.constants';
import {
  BONUS_POINTS_FOR_ROUND_WINNER,
  DEFAULT_TIMEOUT_MS,
  POINTS_PER_VOTE,
} from '../../../constants/game.constants';
import { RoundResults } from '../../../types/round.types';
import { PlayerVote, VotingEndedData } from '../../../types/voting.types';

const sortRoundResultsDescending = (
  roundResults: RoundResults[],
): RoundResults[] => {
  return roundResults.sort((a, b) => b.points - a.points);
};

const handleBonusPoints = (roundResults: RoundResults[]): RoundResults[] => {
  const roundLeaderboard = sortRoundResultsDescending(roundResults);

  const winningScore = roundLeaderboard[0].points;

  // find how many players with a winning score
  const resultsWithWinningScore = roundLeaderboard.filter(
    (result) => result.points === winningScore,
  );

  // check for single winner
  if (resultsWithWinningScore.length === 1) {
    // add bonus points for one player (first in array must have highest points)
    roundLeaderboard[0].points += BONUS_POINTS_FOR_ROUND_WINNER;
  }

  // split the points to multiple winners
  const splitBonusPointsPerPlayer = Math.round(
    BONUS_POINTS_FOR_ROUND_WINNER / resultsWithWinningScore.length,
  );

  for (const player of resultsWithWinningScore) {
    player.points += splitBonusPointsPerPlayer;
  }

  return roundLeaderboard;
};

const calculatePointsPerPlayer = (game: Game, votes: PlayerVote[]) => {
  const { players } = game.getGameState();

  const roundResults: RoundResults[] = [];

  for (const player of players) {
    // find votes for each player
    const votesForPlayer = votes.filter(
      (vote) => vote.playerVoteFor === player.clientId,
    );

    // calculate points for each player
    const pointsForPlayer = votesForPlayer.length * POINTS_PER_VOTE;

    const roundResultForPlayer: RoundResults = {
      player: player,
      points: pointsForPlayer,
    };

    roundResults.push(roundResultForPlayer);
  }

  // add bonus points (split if multiple on the same)
  // return sorted leaderboard by points descending
  handleBonusPoints(roundResults);

  return roundResults;
};

const calculateVotingResults = (round: number, game: Game) => {
  const player = game.getPlayer();

  if (!player.isHost) {
    // only the host should maintain the game state
    return;
  }

  const currentRound = game.getGameState().rounds[round - 1];
  const results = calculatePointsPerPlayer(game, currentRound.votes);

  return results;
};

const waitForVotingEnd = async (round: number, game: Game, socket: Socket) => {
  const currentPlayer = game.getPlayer();
  const { players, rounds } = game.getGameState();
  const currentRound = rounds[round - 1];
  const { votes } = currentRound;

  if (currentPlayer.isHost) {
    try {
      await game.waitUntil(
        () => votes.length === players.length,
        DEFAULT_TIMEOUT_MS,
      );

      // calculate results
      const results = calculateVotingResults(round, game);

      // add results to game state
      for (const result of results) {
        currentRound.results.push(result);
      }

      // voting end data
      const votingEndData: VotingEndedData = {
        gameId: game.getGameId(),
        round: round,
        gameState: game.getGameState(),
      };

      console.log('voting ending...');
      socket.emit(VOTING_END, votingEndData);
    } catch (err) {
      console.log(err);
      // can flag players who didn't submit here....
    }
  }
};

export const initialiseVotingEnded = async (
  round: number,
  game: Game,
  socket: Socket,
) => {
  await waitForVotingEnd(round, game, socket);
};
