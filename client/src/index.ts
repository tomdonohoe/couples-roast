import { io } from 'socket.io-client';
const socket = io();

import { Game } from './common/Game';
import { initialiseGameHandlers } from './handlers/game/game.handlers';
import { initialiseResultHandlers } from './handlers/result/result.handlers';
import { initialiseRoundHandlers } from './handlers/round/round.handlers';
import { initialiseVotingHandlers } from './handlers/voting/voting.handlers';

const game: Game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  initialiseGameHandlers(game, socket);
  initialiseRoundHandlers(game, socket);
  initialiseVotingHandlers(game, socket);
  initialiseResultHandlers(game, socket);
});
