import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { isHost } from '../../helpers/game.helpers';
import { initialiseCreateGame } from './createGame/createGame.handlers';
import { initialiseGameStarting } from './gameStarting/gameStarting.handlers';
import { initialiseJoinGame } from './joinGame/joinGame.handlers';

export const initialiseGameHandlers = (game: Game, socket: Socket) => {
  const shouldRenderForHost = isHost();

  if (shouldRenderForHost) {
    initialiseCreateGame(game, socket);
  } else {
    initialiseJoinGame(game, socket);
  }

  initialiseGameStarting(socket, game);
};
