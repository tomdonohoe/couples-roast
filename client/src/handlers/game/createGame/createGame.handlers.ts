import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { GAME_CREATE, GAME_CREATED } from '../../../constants/event.constants';
import { generateGameId } from '../../../helpers/game.helpers';
import { GameCreateData, GameCreatedData } from '../../../types/game.types';
import { initialiseConnectedPlayers } from '../connectedPlayers/connectedPlayers.handlers';
import { initialiseInviteFriends } from '../inviteFriends/inviteFriends.handlers';
import { initialiseStartGame } from '../startGame/startGame.handlers';

const createGameSection: HTMLElement = document.querySelector('.create-game');
const createGameForm: HTMLElement =
  document.querySelector('.create-game__form');
const createGameFormInput: HTMLInputElement =
  document.querySelector('.create-game__name');

const showCreateGameSection = (): void => {
  createGameSection.style.display = 'block';
};

const hideCreateGameSection = (): void => {
  createGameSection.style.display = 'none';
};

const createGame = (event: SubmitEvent, socket: Socket): void => {
  event.preventDefault();

  const friendlyName = createGameFormInput.value;

  if (friendlyName) {
    const gameId = generateGameId();

    const gameCreateData: GameCreateData = {
      gameId: gameId,
      friendlyName: friendlyName,
    };

    socket.emit(GAME_CREATE, gameCreateData);
  }
};

const onGameCreated = (data: GameCreatedData, game: Game, socket: Socket) => {
  const { gameId, host, player } = data;
  game.setGameId(gameId);
  game.setHost(host);
  game.setPlayer(player);
  const { players } = game.getGameState();
  players.push(player);

  console.log(game);

  hideCreateGameSection();
  initialiseInviteFriends(game);
  initialiseConnectedPlayers(game, socket);
  initialiseStartGame(game, socket);
};

export const initialiseCreateGame = (game: Game, socket: Socket) => {
  showCreateGameSection();
  createGameForm.addEventListener('submit', (event: SubmitEvent) =>
    createGame(event, socket),
  );
  socket.on(GAME_CREATED, (data: GameCreatedData) =>
    onGameCreated(data, game, socket),
  );
};
