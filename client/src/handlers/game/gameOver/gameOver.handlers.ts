import { Socket } from 'socket.io-client';

import { GAME_OVER } from '../../../constants/event.constants';
import { ResultsGameEndData } from '../../../types/result.types';

const gameOverSection: HTMLElement = document.querySelector('.game-over');

const showGameOverSection = (): void => {
  gameOverSection.style.display = 'block';
};

const onGameOver = (data: ResultsGameEndData): void => {
  console.log(data);
  showGameOverSection();
};

export const initialiseGameOver = (socket: Socket) => {
  socket.on(GAME_OVER, (data: ResultsGameEndData) => onGameOver(data));
};
