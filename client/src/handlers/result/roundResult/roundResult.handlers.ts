import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
  RESULTS_ROUND,
  RESULTS_ROUND_END,
} from '../../../constants/event.constants';
import { sleepForSeconds } from '../../../helpers/common.helpers';
import { VotingEndedData } from '../../../types/voting.types';
import { removeRoundResultsSection } from '../../voting/playerVotes/playerVotes.handlers';

const roundLeaderboardSection: HTMLElement =
  document.querySelector('.round-leaderboard');
const roundLeaderboardSectionList = document.querySelector(
  '.round-leaderboard__list',
);

const showRoundLeaderboardSection = (): void => {
  roundLeaderboardSection.style.display = 'block';
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
  const player = game.getPlayer();
  const { gameState } = data;

  if (!player.isHost) {
    game.setGameState(gameState);
  }

  // hide player voting screen
  removeRoundResultsSection();

  // adds points to leaderboard in DOM
  addRoundLeaderboard(data.round, game);

  showRoundLeaderboardSection();

  // wait 10 seconnds then trigger round end
  await sleepForSeconds(10);

  if (player.isHost) {
    // tell server to start next round
    socket.emit(RESULTS_ROUND_END);
  }
};

export const initialiseRoundResult = (game: Game, socket: Socket) => {
  socket.on(RESULTS_ROUND, (data: VotingEndedData) =>
    createRoundLeaderboard(data, game, socket),
  );
};
