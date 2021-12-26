import { Game } from '../../../common/Game';
import { calculateGameLeaderboard } from '../../../helpers/result.helpers';

const gameLeaderboardSection: HTMLElement =
  document.querySelector('.game-leaderboard');
const gameLeaderboardSectionList = document.querySelector(
  '.game-leaderboard__list',
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
