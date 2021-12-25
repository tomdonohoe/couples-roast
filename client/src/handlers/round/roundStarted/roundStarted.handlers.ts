import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { ROUND_STARTED } from '../../../constants/event.constants';
import { RoundStartData } from '../../../types/round.types';
import { removeGameStartingSection } from '../../game/gameStarting/gameStarting.handlers';
import { initialisePlayerRoastCaption } from '../playerRoastCaption/playerCaption.handlers';
import { initialiseRoundEnded } from '../roundEnded/roundEnded.handlers';

const roundSection: HTMLElement = document.querySelector('.round');
const roundSectionImage: HTMLImageElement =
  document.querySelector('.round__image');

const showRoundSection = (): void => {
  roundSection.style.display = 'block';
};

const hideRoundSection = (): void => {
  roundSection.style.display = 'none';
};

const onRoundStarted = (data: RoundStartData, socket: Socket, game: Game) => {
  const { gameState, round } = data;
  const player = game.getPlayer();

  if (!player.isHost) {
    // update game state for guests.
    game.setGameState(gameState);
  }

  // removes the game starting message + rules
  removeGameStartingSection();

  // adds roast image to screen
  addRoundSection(data);

  // handles submission of player roast caption to server
  initialisePlayerRoastCaption(game, data, socket);

  // listens for the game end and tells server
  initialiseRoundEnded(round, game, socket);
};

const addRoundSection = (data: RoundStartData) => {
  showRoundSection();
  roundSectionImage.src = data.photo.src.landscape;
};

export const initialiseRoundStarted = (game: Game, socket: Socket) => {
  socket.on(ROUND_STARTED, (data: RoundStartData) =>
    onRoundStarted(data, socket, game),
  );
};

export const removeRoundStarted = (): void => {
  hideRoundSection();
};
