import { Socket } from 'socket.io-client';

import { Game } from '../../common/Game';
import { sleepForSeconds } from '../../helpers/game.helpers';
import { GAME_STARTED } from '../../constants/event.constants';
import { removeInviteFriends } from '../inviteFriends/inviteFriends.handlers';
import { removeStartGame } from '../startGame/startGame.handlers';

const gameStartingSection: HTMLElement = document.querySelector('.game-starting');

const showGameStartingSection = (): void => {
    gameStartingSection.style.display = 'block';
};

const hideGameStartingSection = (): void => {
    gameStartingSection.style.display = 'none';
};

const onGameStarting = async (game: Game): Promise<void> => {
    const { isHost } = game.getPlayer();

    removeInviteFriends();
    removeStartGame();
    showGameStartingSection();
    console.log('game started')

    if (isHost) {
        // host wait 5 seconds then trigger round start
        await sleepForSeconds(5);
        console.log('start round!')
    }
};

export const initialiseGameStarting = (socket: Socket, game: Game) => {
  socket.on(GAME_STARTED, () => onGameStarting(game));
};
