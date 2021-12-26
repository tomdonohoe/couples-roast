import { Game } from '../../../common/Game';
import { MAX_NUMBER_OF_ROUNDS } from '../../../constants/game.constants';
import { calculateGameLeaderboard } from '../../../helpers/result.helpers';

const gameLeaderboardSection: HTMLElement =
  document.querySelector('.game-leaderboard');
const gameLeaderboardSectionList = document.querySelector(
  '.game-leaderboard__list',
);
const gameLeaderboardSectionHeading: HTMLElement = document.querySelector(
  '.game-leaderboard__heading',
);

const showGameLeaderboardSection = (): void => {
  gameLeaderboardSection.style.display = 'block';
};

const hideGameLeaderboardSection = (): void => {
  gameLeaderboardSection.style.display = 'none';
};

const removeGameLeaderboardSectionList = (): void => {
  gameLeaderboardSectionList.innerHTML = '';
};

const addGameLeaderboard = (game: Game) => {
  const { rounds } = game.getGameState();
  const { players } = game.getGameState();
  const currentRoundGameLeaderboard = calculateGameLeaderboard(rounds, players);

  if (rounds.length === MAX_NUMBER_OF_ROUNDS) {
    const winner = currentRoundGameLeaderboard[0].player.friendlyName;
    gameLeaderboardSectionHeading.innerHTML = `And the winner is ${winner}!`;
  } else {
    gameLeaderboardSectionHeading.innerHTML = 'The current game leaders are:';
  }

  for (const result of currentRoundGameLeaderboard) {
    const playerPoints = document.createElement('li');
    const text = document.createTextNode(
      `${result.player.friendlyName}: ${result.points} points`,
    );
    playerPoints.appendChild(text);
    gameLeaderboardSectionList.appendChild(playerPoints);
  }
};

const createGameLeaderboard = (game: Game): void => {
  // remove previous round game leaderboard results
  removeGameLeaderboardSectionList();

  // adds points to leaderboard in DOM
  addGameLeaderboard(game);

  showGameLeaderboardSection();
};

export const initialiseGameResult = (game: Game) => {
  createGameLeaderboard(game);
};

export const removeGameResult = () => {
  hideGameLeaderboardSection();
};
