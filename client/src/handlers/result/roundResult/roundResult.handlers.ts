import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
  RESULTS_ROUND,
  RESULTS_ROUND_END,
} from '../../../constants/event.constants';
import { sleepForSeconds } from '../../../helpers/common.helpers';
import { ResultsRoundEndData } from '../../../types/result.types';
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

  // wait 3 seconnds then trigger round end
  await sleepForSeconds(3);

  // hide game leaders from screen
  removeGameResult();

  if (player.isHost) {
    const resultsRoundEndData: ResultsRoundEndData = {
      gameId: game.getGameId(),
      round: data.round,
      host: game.getHost(),
    };

    // tell server to start next round
    socket.emit(RESULTS_ROUND_END, resultsRoundEndData);
  }
};

export const initialiseRoundResult = (game: Game, socket: Socket) => {
  socket.on(RESULTS_ROUND, (data: VotingEndedData) =>
    createRoundLeaderboard(data, game, socket),
  );
};
