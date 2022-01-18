import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { ROUND_STARTED } from '../../../constants/event.constants';
import { RoundStartData } from '../../../types/round.types';
import { removeGameStartingSection } from '../../game/gameStarting/gameStarting.handlers';
import { initialisePlayerRoastCaption } from '../playerRoastCaption/playerCaption.handlers';
import { initialiseRoundEnded } from '../roundEnded/roundEnded.handlers';
import { resetForNewRound } from '../startRound/startRound.handlers';

const roundSection: HTMLElement = document.querySelector('.round');
const roundSectionImage: HTMLImageElement =
  document.querySelector('.round__image');
const roundSectionImagePhotographer: HTMLElement = document.querySelector(
  '.round__imageMetaPhotographer',
);
const roundSectionImagePexelsLink: HTMLAnchorElement = document.querySelector(
  '.round__imageMetaPexelsLink',
);
const roundSectionCaptionForm: HTMLElement = document.querySelector(
  '.round_captionContainer',
);
const roundSectionHostScreenMessage: HTMLElement = document.querySelector(
  '.round__hostScreenMessage',
);

export const showRoundSection = (): void => {
  roundSection.style.display = 'block';
};

export const hideRoundSection = (): void => {
  roundSection.style.display = 'none';
};

const hideRoundSectionCaptionForm = (): void => {
  roundSectionCaptionForm.style.display = 'none';
};

const showRoundSectionHostScreenMessage = (): void => {
  roundSectionHostScreenMessage.style.display = 'block';
};

const addRoundSection = (data: RoundStartData, game: Game) => {
  showRoundSection();
  const { photo } = data;
  roundSectionImage.src = photo.src.landscape;
  roundSectionImagePhotographer.textContent = photo.photographer;
  roundSectionImagePexelsLink.href = photo.url;

  if (game.getPlayer().isHost) {
    hideRoundSectionCaptionForm();
    showRoundSectionHostScreenMessage();
  }
};

const onRoundStarted = (data: RoundStartData, socket: Socket, game: Game) => {
  const { gameState, round } = data;
  const player = game.getPlayer();

  if (!player.isHost) {
    // update game state for guests.
    game.setGameState(gameState);
  }

  if (round > 1) {
    resetForNewRound();
  }

  // removes the game starting message + rules
  removeGameStartingSection();

  // adds roast image to screen
  addRoundSection(data, game);

  // handles submission of player roast caption to server
  initialisePlayerRoastCaption(game, data, socket);

  // listens for the game end and tells server
  initialiseRoundEnded(round, game, socket);
};

export const initialiseRoundStarted = (game: Game, socket: Socket) => {
  socket.on(ROUND_STARTED, (data: RoundStartData) =>
    onRoundStarted(data, socket, game),
  );
};

export const removeRoundStarted = (): void => {
  hideRoundSection();
};
