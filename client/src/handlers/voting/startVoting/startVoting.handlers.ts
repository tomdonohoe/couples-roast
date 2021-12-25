import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import { VOTING_START } from '../../../constants/event.constants';
import { Round, RoundEndedData } from '../../../types/round.types';
import { removeRoundStarted } from '../../round/roundStarted/roundStarted.handlers';
import { initialiseVotingEnded } from '../endVoting/endVoting.handlers';
import { initialisePlayerVoteSubmission } from '../playerVotes/playerVotes.handlers';

const roundResultsSection: HTMLElement =
  document.querySelector('.round-results');
const roundResultsSectionImage: HTMLImageElement = document.querySelector(
  '.round-results__image',
);
const roundResultsSectionCaptions: HTMLElement = document.querySelector(
  '.round-results_captions',
);

const showRoundResultsSection = (): void => {
  roundResultsSection.style.display = 'block';
};

const addRoundCaptionsForVoting = (data: Round): void => {
  showRoundResultsSection();

  roundResultsSectionImage.src = data.photo.src.landscape;
  const captions = data.captions;

  // disable voting for yourself:
  // const captions = roundData.captions.filter(caption => caption.player.clientId !== game.playerIdentity.clientId);

  for (const caption of captions) {
    const playerCaption = document.createElement('li');
    const text = document.createTextNode(
      `${caption.player.friendlyName}: ${caption.caption}`,
    );
    playerCaption.appendChild(text);
    playerCaption.setAttribute('data-client-id', caption.player.clientId);
    playerCaption.classList.add('round-results_caption');
    roundResultsSectionCaptions.appendChild(playerCaption);
  }
};

const onStartVoting = (data: RoundEndedData, socket: Socket, game: Game) => {
  removeRoundStarted();

  const { round } = data;
  const player = game.getPlayer();

  if (!player.isHost) {
    // if not host update stategot to wait for voting to end
    game.setGameState(data.gameState);
  }

  // add player captions to screen for voting
  const currentRound = game.getGameState().rounds[round - 1];
  addRoundCaptionsForVoting(currentRound);

  // handles sending votes to server
  initialisePlayerVoteSubmission(currentRound, game, socket);

  // listens for voting to end
  initialiseVotingEnded(currentRound.number, game, socket);
};

export const initialiseStartVoting = (game: Game, socket: Socket) => {
  socket.on(VOTING_START, (data: RoundEndedData) =>
    onStartVoting(data, socket, game),
  );
};
