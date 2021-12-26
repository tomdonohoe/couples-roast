import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { GAME_NEW_PLAYER_JOINED } from '../../../constants/event.constants';
import { GameNewPlayerJoinedData, Player } from '../../../types/game.types';
import { generateRandomHexColor } from '../../../helpers/game.helpers';

const playersSection: HTMLElement = document.querySelector('.players');
const playersSectionList: HTMLElement =
  document.querySelector('.players__list');

const showConnectedPlayersSection = (): void => {
  playersSection.style.display = 'block';
};

const createConnectedPlayerItem = (player: Player): void => {
  const color = generateRandomHexColor(6);
  console.log(color);
  const div = document.createElement('div');
  div.classList.add('players__connectedPlayer')

  const span = document.createElement('span');
  span.classList.add('players__dot');
  span.style.backgroundColor = `#${color}`;

  const connectedPlayer = document.createElement('span');
  connectedPlayer.classList.add('players__connectedPlayerName');
  const connectedPlayerName = document.createTextNode(player.friendlyName)
  connectedPlayer.appendChild(connectedPlayerName);

  div.appendChild(span);
  div.appendChild(connectedPlayer);
  playersSectionList.appendChild(div);
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
