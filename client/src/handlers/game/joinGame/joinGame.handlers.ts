import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
  GAME_ALREADY_STARTED,
  GAME_FULL,
  GAME_JOIN,
  GAME_JOINED,
} from '../../../constants/event.constants';
import { getGameIdFromUrl } from '../../../helpers/game.helpers';
import {
  GameJoinData,
  GameJoinedData,
  GameJoinErrorData,
} from '../../../types/game.types';
import { initialiseConnectedPlayers } from '../connectedPlayers/connectedPlayers.handlers';
import { initialiseInviteFriends } from '../inviteFriends/inviteFriends.handlers';
import { initialiseStartGame } from '../startGame/startGame.handlers';

const joinGameSection: HTMLElement = document.querySelector('.join-game');
const joinGameForm: HTMLElement = document.querySelector('.join-game__form');
const joinGameFormInput: HTMLInputElement =
  document.querySelector('.join-game__name');

const showJoinGameSectionSection = (): void => {
  joinGameSection.style.display = 'block';
};

const hideJoinGameSection = (): void => {
  joinGameSection.style.display = 'none';
};

const hideJoinGameSectionForm = (): void => {
  joinGameForm.style.display = 'none';
};

const joinGame = (event: SubmitEvent, socket: Socket): void => {
  event.preventDefault();

  const friendlyName = joinGameFormInput.value;

  if (friendlyName) {
    const gameId = getGameIdFromUrl();

    const gameJoinData: GameJoinData = {
      gameId: gameId,
      friendlyName: friendlyName,
    };

    socket.emit(GAME_JOIN, gameJoinData);
  }
};

const onGameJoined = (
  data: GameJoinedData,
  game: Game,
  socket: Socket,
): void => {
  const { gameId, host, player, currentPlayers } = data;

  game.setGameId(gameId);
  game.setHost(host);
  game.setPlayer(player);
  const { players } = game.getGameState();
  for (const player of currentPlayers) {
    players.push(player);
  }

  console.log('onGameJoinedState:');
  console.log(game);

  hideJoinGameSection();
  initialiseInviteFriends(game);
  initialiseConnectedPlayers(game, socket);
  initialiseStartGame(game);
};

const onGameJoinError = (data: GameJoinErrorData) => {
  hideJoinGameSectionForm();

  const message = document.createElement('p');
  const messageText = document.createTextNode(data.message);
  message.appendChild(messageText);
  joinGameSection.appendChild(message);
};

export const initialiseJoinGame = (game: Game, socket: Socket) => {
  showJoinGameSectionSection();
  joinGameForm.addEventListener('submit', (event: SubmitEvent) =>
    joinGame(event, socket),
  );
  socket.on(GAME_JOINED, (data: GameJoinedData) =>
    onGameJoined(data, game, socket),
  );
  socket.on(GAME_FULL, onGameJoinError);
  socket.on(GAME_ALREADY_STARTED, onGameJoinError);
};
