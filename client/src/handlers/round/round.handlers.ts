import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { initialiseStartRound } from './startRound/startRound.handlers';

export const initialiseRoundHandlers = (game: Game, socket: Socket) => {
    initialiseStartRound(game, socket);
};
