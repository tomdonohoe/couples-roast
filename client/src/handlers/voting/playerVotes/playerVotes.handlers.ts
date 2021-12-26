import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
  VOTING_PLAYER_VOTE,
  VOTING_SUBMITTED_PLAYER_VOTE,
} from '../../../constants/event.constants';
import { Round } from '../../../types/round.types';
import { VotingPlayerVote } from '../../../types/voting.types';

const roundResultsSection: HTMLElement =
  document.querySelector('.round-results');
const roundResultsSectionVoteOptions: HTMLElement = document.querySelector(
  '.round-results__voteOptions',
);
const roundResultsSectionCaptions: HTMLElement = document.querySelector(
  '.round-results_captions',
);
const roundResultsWaitingForOthers: HTMLElement = document.querySelector(
  '.round-results__waitingForOthers',
);

const hideRoundResultsSection = (): void => {
  roundResultsSection.style.display = 'none';
};

const showRoundResultsSectionVoteOptions = (): void => {
  roundResultsSectionVoteOptions.style.display = 'block';
};

const hideRoundResultsSectionVoteOptions = (): void => {
  roundResultsSectionVoteOptions.style.display = 'none';
};

const showRoundResultsWaitingForOthers = (): void => {
  roundResultsWaitingForOthers.style.display = 'block';
};

const hideRoundResultsWaitingForOthers = (): void => {
  roundResultsWaitingForOthers.style.display = 'none';
};

const removeRoundResultsSectionCaptions = (): void => {
  roundResultsSectionCaptions.innerHTML = '';
};

const handlePlayerVoteSubmission = (
  event: any,
  data: Round,
  socket: Socket,
  game: Game,
) => {
  const clientId = event.target.getAttribute('data-client-id');
  removeRoundResultsSectionCaptions();
  hideRoundResultsSectionVoteOptions();
  showRoundResultsWaitingForOthers();

  const playerVote: VotingPlayerVote = {
    gameId: game.getGameId(),
    round: data,
    player: game.getPlayer(),
    host: game.getHost(),
    vote: {
      playerVoteFor: clientId,
    },
  };

  socket.emit(VOTING_PLAYER_VOTE, playerVote);
};

const submitPlayerVote = (socket: Socket, game: Game) => {
  const playerRoastCaptions = document.querySelectorAll(
    '.round-results__caption',
  );

  console.log('player roast captions');
  console.log(playerRoastCaptions);

  const { rounds } = game.getGameState();
  const currentRound = rounds[rounds.length - 1];

  for (let i = 0; i < playerRoastCaptions.length; i++) {
    const roastCaption = playerRoastCaptions[i];
    roastCaption.addEventListener('click', (event: any) =>
      handlePlayerVoteSubmission(event, currentRound, socket, game),
    );
  }
};

const onSubmittedPlayerVote = (data: VotingPlayerVote, game: Game) => {
  const currentPlayer = game.getPlayer();

  if (!currentPlayer.isHost) {
    // return early if not the host
    return;
  }

  // adds submitted vote to game state
  const { round, vote } = data;

  const currentRound = game.getGameState().rounds[round.number - 1];
  currentRound.votes.push(vote);
};

export const initialisePlayerVoteSubmission = (
  data: Round,
  game: Game,
  socket: Socket,
) => {
  const roundNumber = data.number;
  submitPlayerVote(socket, game);

  if (roundNumber === 1) {
    socket.on(VOTING_SUBMITTED_PLAYER_VOTE, (data: VotingPlayerVote) =>
      onSubmittedPlayerVote(data, game),
    );
  }
};

export const removeRoundResultsSection = () => {
  hideRoundResultsSection();
};

export const resetRoundResultsSection = () => {
  // deletes the waiting for others element from DOM
  hideRoundResultsWaitingForOthers();

  // enables showing captions to vote for
  showRoundResultsSectionVoteOptions();
};
