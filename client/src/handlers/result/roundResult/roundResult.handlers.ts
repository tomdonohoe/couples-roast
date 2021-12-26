import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
  RESULTS_GAME_END,
  RESULTS_ROUND,
  RESULTS_ROUND_END,
} from '../../../constants/event.constants';
import { MAX_NUMBER_OF_ROUNDS } from '../../../constants/game.constants';
import { sleepForSeconds } from '../../../helpers/common.helpers';
import {
  ResultsGameEndData,
  ResultsRoundEndData,
} from '../../../types/result.types';
import { VotingEndedData } from '../../../types/voting.types';
import { removeRoundResultsSection } from '../../voting/playerVotes/playerVotes.handlers';
import {
  initialiseGameResult,
  removeGameResult,
} from '../gameResult/gameResult.handlers';

const roundLeaderboardSection: HTMLElement =
  document.querySelector('.round-leaderboard');
const roundLeaderboardSectionList = document.querySelector(
  '.round-leaderboard__list',
);

const showRoundLeaderboardSection = (): void => {
  roundLeaderboardSection.style.display = 'block';
};

const hideRoundLeaderboardSection = (): void => {
  roundLeaderboardSection.style.display = 'none';
};

const removeRoundLeaderboardSectionList = (): void => {
  roundLeaderboardSectionList.innerHTML = '';
};

const addRoundLeaderboard = (round: number, game: Game) => {
  const { rounds } = game.getGameState();
  const currentRoundResults = rounds[round - 1].results;

  for (const result of currentRoundResults) {
    const playerPoints = document.createElement('li');
    const text = document.createTextNode(
      `${result.player.friendlyName}: ${result.points} points`,
    );
    playerPoints.appendChild(text);
    roundLeaderboardSectionList.appendChild(playerPoints);
  }
};

const createRoundLeaderboard = async (
  data: VotingEndedData,
  game: Game,
  socket: Socket,
): Promise<void> => {
  const roundNumber = data.round;
  const player = game.getPlayer();
  const { gameState } = data;

  if (!player.isHost) {
    game.setGameState(gameState);
  }

  // remove previous round results
  removeRoundLeaderboardSectionList();

  // hide player voting screen
  removeRoundResultsSection();

  // adds points to leaderboard in DOM
  addRoundLeaderboard(data.round, game);

  // begin showing round winners from round 2 onwards
  if (roundNumber > 1) {
    showRoundLeaderboardSection();

    // wait 3 seconnds then trigger current game leaders
    await sleepForSeconds(3);

    hideRoundLeaderboardSection();
  }

  // show who is leading the game
  initialiseGameResult(game);

  if (roundNumber < MAX_NUMBER_OF_ROUNDS) {
    // wait 3 seconnds then trigger round end
    await sleepForSeconds(3);

    // hide game leaders from screen
    removeGameResult();
  }

  if (player.isHost) {
    const gameId = game.getGameId();

    if (roundNumber < MAX_NUMBER_OF_ROUNDS) {
      const resultsRoundEndData: ResultsRoundEndData = {
        gameId: gameId,
        round: data.round,
        host: game.getHost(),
      };

      // tell server to start next round
      socket.emit(RESULTS_ROUND_END, resultsRoundEndData);
    } else {
      const resultsGameEndData: ResultsGameEndData = {
        gameId: gameId,
      };
      // tell server to end the game
      socket.emit(RESULTS_GAME_END, resultsGameEndData);
    }
  }
};

export const initialiseRoundResult = (game: Game, socket: Socket) => {
  socket.on(RESULTS_ROUND, (data: VotingEndedData) =>
    createRoundLeaderboard(data, game, socket),
  );
};
