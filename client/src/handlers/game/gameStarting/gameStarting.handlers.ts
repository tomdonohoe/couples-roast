import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
  GAME_BEGIN_ROUNDS,
  GAME_STARTED,
} from '../../../constants/event.constants';
import { sleepForSeconds } from '../../../helpers/common.helpers';
import { BeginRoundsData } from '../../../types/game.types';
import { removeInviteFriends } from '../inviteFriends/inviteFriends.handlers';
import { removeStartGame } from '../startGame/startGame.handlers';

const gameStartingSection: HTMLElement =
  document.querySelector('.game-starting');

const showGameStartingSection = (): void => {
  gameStartingSection.style.display = 'block';
};

const hideGameStartingSection = (): void => {
  gameStartingSection.style.display = 'none';
};

const onGameStarting = async (game: Game, socket: Socket): Promise<void> => {
  const player = game.getPlayer();
  const gameId = game.getGameId();

  removeInviteFriends();
  removeStartGame();
  showGameStartingSection();

  if (player.isHost) {
    // host wait 30 seconds then trigger round start
    await sleepForSeconds(3);
    const beginRoundsData: BeginRoundsData = {
      gameId: gameId,
      host: player,
    };
    socket.emit(GAME_BEGIN_ROUNDS, beginRoundsData);
  }
};

export const initialiseGameStarting = (socket: Socket, game: Game) => {
  socket.on(GAME_STARTED, () => onGameStarting(game, socket));
};

export const removeGameStartingSection = () => {
  hideGameStartingSection();
};
