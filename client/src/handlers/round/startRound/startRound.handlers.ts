import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
    ROUND_BEGIN,
    ROUND_START,
} from '../../../constants/event.constants';
import { PHOTOS } from '../../../constants/photo.constants';
import {
    Round,
    RoundBeginData,
    RoundStartData,
} from '../../../types/round.types';
import { getPhotoById } from '../../../helpers/api.helpers';
import { Photo } from '../../../types/api.types';

const onRoundBegin = async (data: RoundBeginData, socket: Socket, game: Game, round: number = 1) => {
    const gameState = game.getGameState();
    const { rounds } = gameState;

    const res = await getPhotoById(PHOTOS[round - 1]);
    const photo: Photo = await res.json();
    
    const currentRound: Round = {
        number: round,
        photo: photo
    }

    // add current round to gameState
    rounds.push(currentRound);

    const roundStartData: RoundStartData = {
        gameId: data.gameId,
        photo: photo,
        gameState: gameState,
    };

    socket.emit(ROUND_START, roundStartData);   
};

export const initialiseStartRound = (game: Game, socket: Socket) => {

  socket.on(ROUND_BEGIN, (data: RoundBeginData) => onRoundBegin(data, socket, game));
};
