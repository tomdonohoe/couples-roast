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
const roundSectionCaptionContainerWaitForOthers: HTMLElement =
  document.querySelector('.round__waitingForOthers');

const showRoundSectionForm = (): void => {
  roundSectionForm.style.display = 'block';
};

const hideRoundSectionForm = (): void => {
  roundSectionForm.style.display = 'none';
};

const showRoundWaitingForOthers = (): void => {
  roundSectionCaptionContainerWaitForOthers.style.display = 'block';
};

const hideRoundWaitingForOthers = (): void => {
  roundSectionCaptionContainerWaitForOthers.style.display = 'none';
};

const handleAfterRoastSubmission = () => {
  hideRoundSectionForm();
  showRoundWaitingForOthers();
};

const submitRoastCaption = (event: SubmitEvent, socket: Socket, game: Game) => {
  event.preventDefault();
  const gameId = game.getGameId();
  const { rounds } = game.getGameState();
  const currentRound = rounds[rounds.length - 1];
  const roastCaption = roundSectionFormInput.value ? roundSectionFormInput.value : 'nothing submitted....';

  const playerCaption: RoundPlayerCaption = {
    gameId: gameId,
    round: currentRound.number,
    player: game.getPlayer(),
    host: game.getHost(),
    caption: roastCaption,
  };
  socket.emit(ROUND_PLAYER_CAPTION, playerCaption);

  roundSectionFormInput.value = '';

  handleAfterRoastSubmission();
};

const onSubmittedRoastCaption = (data: RoundPlayerCaption, game: Game) => {
  const currentPlayer = game.getPlayer();
  console.log('called!');
  if (!currentPlayer.isHost) {
    // return early if not the host
    return;
  }

  // adds submitted caption to game state
  const { player, caption } = data;
  const playerSubmittedCaption: SubmittedPlayerCaption = {
    player: player,
    caption: caption,
  };
  const { rounds } = game.getGameState();
  // we can get current round by finding last in array
  const currentRound = rounds[rounds.length - 1];
  currentRound.captions.push(playerSubmittedCaption);
};

export const initialisePlayerRoastCaption = (
  game: Game,
  data: RoundStartData,
  socket: Socket,
) => {
  const roundNumber = data.round;
  // only register listeners on intialisation at round 1
  // this avoids duplication in game state from multiple listeners
  if (roundNumber === 1) {
    roundSectionForm.addEventListener('submit', (event: SubmitEvent) =>
      submitRoastCaption(event, socket, game),
    );
    socket.on(ROUND_SUBMITTED_PLAYER_CAPTION, (data: RoundPlayerCaption) =>
      onSubmittedRoastCaption(data, game),
    );
  }
};

export const resetPlayerRoastCaption = () => {
  showRoundSectionForm();
  hideRoundWaitingForOthers();
};
