import { io } from 'socket.io-client';
const socket = io();

import { Game } from './common/Game';
import { initialiseGameHandlers } from './handlers/game/game.handlers';
import { initialiseRoundHandlers } from './handlers/round/round.handlers';

const game: Game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  initialiseGameHandlers(game, socket);
  initialiseRoundHandlers(game, socket);
});
