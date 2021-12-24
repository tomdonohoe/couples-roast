import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { sleepForSeconds } from '../../../helpers/game.helpers';
import { GAME_STARTED, GAME_BEGIN_ROUNDS } from '../../../constants/event.constants';
import { removeInviteFriends } from '../inviteFriends/inviteFriends.handlers';
import { removeStartGame } from '../startGame/startGame.handlers';
import { BeginRoundsData } from '../../../types/game.types';

const gameStartingSection: HTMLElement = document.querySelector('.game-starting');

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
        // host wait 2 seconds then trigger round start
        await sleepForSeconds(2);
        const beginRoundsData: BeginRoundsData = {
            gameId: gameId,
            host: player,
        }
        socket.emit(GAME_BEGIN_ROUNDS, beginRoundsData);
    }
};

export const initialiseGameStarting = (socket: Socket, game: Game) => {
  socket.on(GAME_STARTED, () => onGameStarting(game, socket));
};
