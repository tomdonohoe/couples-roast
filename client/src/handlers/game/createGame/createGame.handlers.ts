import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { GAME_CREATE, GAME_CREATED } from '../../../constants/event.constants';
import { PHOTOS } from '../../../constants/photo.constants';
import { generateGameId } from '../../../helpers/game.helpers';
import { GameCreateData, GameCreatedData } from '../../../types/game.types';
import { initialiseConnectedPlayers } from '../connectedPlayers/connectedPlayers.handlers';
import { initialiseInviteFriends } from '../inviteFriends/inviteFriends.handlers';
import { initialiseStartGame } from '../startGame/startGame.handlers';

const createGameSection: HTMLElement = document.querySelector('.create-game');
const createGameForm: HTMLElement =
  document.querySelector('.create-game__form');
const createGamePhotoSetSelect: HTMLSelectElement = document.querySelector(
  '.create-game__photoSetSelect',
);

const showCreateGameSection = (): void => {
  createGameSection.style.display = 'block';
};

const hideCreateGameSection = (): void => {
  createGameSection.style.display = 'none';
};

const addPhotoSetOptions = (): void => {
  const numberOfPhotoSets = PHOTOS.length;
  // console.log(createGamePhotoSetSelect);

  for (let i = 0; i < numberOfPhotoSets; i++) {
    if (i === 0) {
      createGamePhotoSetSelect.options.add(
        new Option(String(i + 1), String(i), true),
      );
    } else {
      createGamePhotoSetSelect.options.add(
        new Option(String(i + 1), String(i)),
      );
    }
  }
};

const createGame = (event: SubmitEvent, socket: Socket): void => {
  event.preventDefault();
  const gameId = generateGameId();

  const gameCreateData: GameCreateData = {
    gameId: gameId,
    photoSet: Number(createGamePhotoSetSelect.value),
  };

  socket.emit(GAME_CREATE, gameCreateData);
};

const onGameCreated = (data: GameCreatedData, game: Game, socket: Socket) => {
  const { gameId, host, player, photoSet } = data;
  game.setGameId(gameId);
  game.setHost(host);
  game.setPlayer(player);
  game.setPhotoSet(photoSet);

  console.log(game);

  hideCreateGameSection();
  initialiseInviteFriends(game);
  initialiseConnectedPlayers(game, socket);
  initialiseStartGame(game, socket);
};

export const initialiseCreateGame = (game: Game, socket: Socket) => {
  addPhotoSetOptions();
  showCreateGameSection();
  createGameForm.addEventListener('submit', (event: SubmitEvent) =>
    createGame(event, socket),
  );
  socket.on(GAME_CREATED, (data: GameCreatedData) =>
    onGameCreated(data, game, socket),
  );
};
