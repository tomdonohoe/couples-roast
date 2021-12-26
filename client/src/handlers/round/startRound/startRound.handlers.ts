import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { ROUND_BEGIN, ROUND_START } from '../../../constants/event.constants';
import { PHOTOS } from '../../../constants/photo.constants';
import { getPhotoById } from '../../../helpers/api.helpers';
import { Photo } from '../../../types/api.types';
import {
  Round,
  RoundBeginData,
  RoundStartData,
} from '../../../types/round.types';
import { resetVotingForNewRound } from '../../voting/startVoting/startVoting.handlers';
import { resetPlayerRoastCaption } from '../playerRoastCaption/playerCaption.handlers';

const onRoundBegin = async (
  data: RoundBeginData,
  socket: Socket,
  game: Game,
) => {
  const player = game.getPlayer();
  const roundNumber = data.round;

  if (roundNumber > 1) {
    resetForNewRound();
  }

  console.log(`round beginning ${data.round}`);

  if (!player.isHost) {
    return;
  }

  const gameState = game.getGameState();
  const { rounds } = gameState;

  const res = await getPhotoById(PHOTOS[roundNumber - 1]);
  const photo: Photo = await res.json();

  const currentRound: Round = {
    number: roundNumber,
    photo: photo,
    captions: [],
    votes: [],
    results: [],
  };

  // add current round to gameState
  rounds.push(currentRound);

  const roundStartData: RoundStartData = {
    gameId: data.gameId,
    round: roundNumber,
    photo: photo,
    gameState: gameState,
  };

  socket.emit(ROUND_START, roundStartData);
};

export const initialiseStartRound = (game: Game, socket: Socket) => {
  socket.on(ROUND_BEGIN, (data: RoundBeginData) =>
    onRoundBegin(data, socket, game),
  );
};

export const resetForNewRound = (): void => {
  resetVotingForNewRound();
  resetPlayerRoastCaption();
};
