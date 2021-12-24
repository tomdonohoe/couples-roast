import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { GAME_NEW_PLAYER_JOINED } from '../../constants/event.constants';
import { GameNewPlayerJoinedData, Player } from '../../types/game.types';

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

const addConnectedPlayer = (player: Player): void => {
  if (!player) {
    return;
  }

  createConnectedPlayerItem(player);
};

const onNewPlayerJoin = (data: GameNewPlayerJoinedData, game: Game) => {
  const { players } = game.getGameState();
  players.push(data.player);

  addConnectedPlayer(data.player);
};

export const initialiseConnectedPlayers = (game: Game, socket: Socket) => {
  const { players } = game.getGameState();
  showConnectedPlayersSection();
  addConnectedPlayers(players);

  socket.on(GAME_NEW_PLAYER_JOINED, (data: GameNewPlayerJoinedData) =>
    onNewPlayerJoin(data, game),
  );
};
