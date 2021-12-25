import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { VOTING_END } from '../../../constants/event.constants';
import {
    DEFAULT_TIMEOUT_MS,
    POINTS_PER_VOTE,
    BONUS_POINTS_FOR_ROUND_WINNER,
} from '../../../constants/game.constants';
import { PlayerVote, VotingEndedData } from '../../../types/voting.types';
import { RoundResults } from '../../../types/round.types';

const determineRoundWinner = (roundResults: RoundResults[]): RoundResults => {
    return roundResults.sort((a, b) =>  b.points - a.points)[0];
};

const calculatePointsPerPlayer = (game: Game, votes: PlayerVote[]) => {
    const { players } = game.getGameState();

    let roundResults: RoundResults[] = [];

    for (const player of players) {
        // find votes for each player
        const votesForPlayer = votes.filter(vote => vote.playerVoteFor === player.clientId);

        // calculate points for each player
        const pointsForPlayer = votesForPlayer.length * POINTS_PER_VOTE;

        const roundResultForPlayer: RoundResults = {
            player: player,
            points: pointsForPlayer,
        };

        roundResults.push(roundResultForPlayer);
    }

    console.log('round results before bonus');
    console.log(roundResults);

    // determine the round winner 
    const roundWinner = determineRoundWinner(roundResults);

    // add bonus points
    const winner = roundResults.filter(result => result.player === roundWinner.player)[0];
    winner.points += BONUS_POINTS_FOR_ROUND_WINNER;

    console.log('round results after bonus');
    console.log(roundResults);
    return roundResults;
}

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
  const gameId = game.getGameId();
  const currentPlayer = game.getPlayer();
  const { players, rounds } = game.getGameState();
  const currentRound = rounds[round - 1];
  const { votes } = currentRound

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
