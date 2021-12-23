import { Game } from '../../common/Game';
import { Player } from '../../types/game.types';

const playersSection: HTMLElement = document.querySelector('.players');
const playersSectionList: HTMLElement =
  document.querySelector('.players__list');

const showConnectedPlayersSection = (): void => {
  playersSection.style.display = 'block';
};

const createConnectedPlayerItem = (player: Player): void => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(player.friendlyName));
  playersSectionList.appendChild(li);
};

const addConnectedPlayers = (players: Player[]): void => {
  if (players.length <= 0) {
    return;
  }

  for (const player of players) {
    createConnectedPlayerItem(player);
  }
};

export const initialiseConnectedPlayers = (game: Game) => {
  const { players } = game.getGameState();
  showConnectedPlayersSection();
  addConnectedPlayers(players);
};
