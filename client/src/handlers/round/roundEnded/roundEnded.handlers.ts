import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { ROUND_ENDED } from '../../../constants/event.constants';
import { DEFAULT_TIMEOUT_MS } from '../../../constants/game.constants';
import { RoundEndedData } from '../../../types/round.types';

const waitForRoundEnd = async (round: number, game: Game, socket: Socket) => {
  const gameId = game.getGameId();
  const currentPlayer = game.getPlayer();
  const { players, rounds } = game.getGameState();
  const { captions } = rounds[round - 1];

  console.log(`waiting for round ${round} to end`);
  if (currentPlayer.isHost) {
    try {
      await game.waitUntil(
        () => captions.length === players.length,
        DEFAULT_TIMEOUT_MS,
      );
      console.log(players);
      console.log(captions);
      const roundEndedData: RoundEndedData = {
        gameId: gameId,
        round: round,
        gameState: game.getGameState(),
      };

      console.log('round ending...');
      console.log(roundEndedData);
      socket.emit(ROUND_ENDED, roundEndedData);
    } catch (err) {
      console.log('error');
      console.log(err);
      // can flag players who didn't submit here....
    }
  }
};

export const initialiseRoundEnded = async (
  round: number,
  game: Game,
  socket: Socket,
) => {
  await waitForRoundEnd(round, game, socket);
};
