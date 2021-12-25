import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { initialiseRoundResult } from './roundResult/roundResult.handlers';

export const initialiseResultHandlers = (game: Game, socket: Socket) => {
  initialiseRoundResult(game, socket);
};
