import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { initialiseStartVoting } from './startVoting/startVoting.handlers';

export const initialiseVotingHandlers = (game: Game, socket: Socket) => {
    initialiseStartVoting(game, socket);
};
