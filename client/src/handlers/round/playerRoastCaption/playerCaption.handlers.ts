import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
  ROUND_PLAYER_CAPTION,
  ROUND_SUBMITTED_PLAYER_CAPTION,
} from '../../../constants/event.constants';
import {
  RoundPlayerCaption,
  RoundStartData,
  SubmittedPlayerCaption,
} from '../../../types/round.types';

const roundSectionForm: HTMLFormElement =
  document.querySelector('.round__form');
const roundSectionFormInput: HTMLInputElement =
  document.querySelector('.round__caption');

const submitRoastCaption = (
  event: SubmitEvent,
  socket: Socket,
  game: Game,
  data: RoundStartData,
) => {
  event.preventDefault();

  const { gameId, round } = data;
  const roastCaption = roundSectionFormInput.value;

  if (roastCaption) {
    const playerCaption: RoundPlayerCaption = {
      gameId: gameId,
      round: round,
      player: game.getPlayer(),
      host: game.getHost(),
      caption: roastCaption,
    };
    socket.emit(ROUND_PLAYER_CAPTION, playerCaption);
  }
};

const onSubmittedRoastCaption = (data: RoundPlayerCaption, game: Game) => {
  const currentPlayer = game.getPlayer();

  if (!currentPlayer.isHost) {
    // return early if not the host
    return;
  }

  // adds submitted caption to game state
  const { round, player, caption } = data;
  const playerSubmittedCaption: SubmittedPlayerCaption = {
    player: player,
    caption: caption,
  };
  const currentRound = game.getGameState().rounds[round - 1];
  currentRound.captions.push(playerSubmittedCaption);
};

export const initialisePlayerRoastCaption = (
  game: Game,
  data: RoundStartData,
  socket: Socket,
) => {
  roundSectionForm.addEventListener('submit', (event: SubmitEvent) =>
    submitRoastCaption(event, socket, game, data),
  );
  socket.on(ROUND_SUBMITTED_PLAYER_CAPTION, (data: RoundPlayerCaption) =>
    onSubmittedRoastCaption(data, game),
  );
};
