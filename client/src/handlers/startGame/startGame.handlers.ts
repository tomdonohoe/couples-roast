import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { GAME_START } from '../../constants/event.constants';
import { GameStartData } from '../../types/game.types';

const startGameSectionReady: HTMLElement =
  document.querySelector('.start-game__ready');
const startGameSectionBtn: HTMLElement =
  document.querySelector('.start-game__btn');

const showStartGameSectionReady = (): void => {
  startGameSectionReady.style.display = 'block';
};

const startGame = (socket: Socket, game: Game): void => {
  const gameStartData: GameStartData = {
    gameId: game.getGameId(),
  };

  socket.emit(GAME_START, gameStartData);
};

export const initialiseStartGame = (game: Game, socket: Socket) => {
  const { isHost } = game.getPlayer();

  if (isHost) {
    showStartGameSectionReady();
    startGameSectionBtn.addEventListener('click', () =>
      startGame(socket, game),
    );
  } else {
    // to do wait for host to start...
  }
};
