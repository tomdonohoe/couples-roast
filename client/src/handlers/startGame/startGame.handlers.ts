import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { GAME_START } from '../../constants/event.constants';
import { GameStartData } from '../../types/game.types';

const startGameSectionReady: HTMLElement =
  document.querySelector('.start-game__ready');
const startGameSectionBtn: HTMLElement =
  document.querySelector('.start-game__btn');
const startGameSectionWait: HTMLElement =
  document.querySelector('.start-game__wait');
const startGameSectionHost: HTMLElement =
  document.querySelector('.start-game__host');

const showStartGameSectionReady = (): void => {
  startGameSectionReady.style.display = 'block';
};

const showStartGameSectionWait = (): void => {
  startGameSectionWait.style.display = 'block';
};

const startGame = (socket: Socket, game: Game): void => {
  const gameStartData: GameStartData = {
    gameId: game.getGameId(),
  };

  socket.emit(GAME_START, gameStartData);
};

const waitForHostToStartGame = (hostFriendlyName: string) => {
  startGameSectionWait.style.display = 'block';
  startGameSectionHost.textContent = hostFriendlyName;
};

export const initialiseStartGame = (game: Game, socket?: Socket) => {
  const { isHost } = game.getPlayer();

  if (isHost) {
    showStartGameSectionReady();
    startGameSectionBtn.addEventListener('click', () =>
      startGame(socket, game),
    );
  } else {
    showStartGameSectionWait();
    waitForHostToStartGame(game.getHost().friendlyName);
  }
};
