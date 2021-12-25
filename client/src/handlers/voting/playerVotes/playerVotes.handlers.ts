import { Socket } from 'socket.io-client';

import { Game } from '../../../common/Game';
import {
    VOTING_PLAYER_VOTE,
    VOTING_SUBMITTED_PLAYER_VOTE,
} from '../../../constants/event.constants';
import {
    Round,
} from '../../../types/round.types';
import {
    VotingPlayerVote,
    PlayerVote,
} from '../../../types/voting.types';

const roundResultsSection: HTMLElement = document.querySelector('.round-results');
const roundResultsSectionVoteOptions: HTMLElement = document.querySelector('.round-results__voteOptions');

const hideRoundResultsSectionVoteOptions = (): void => {
    roundResultsSectionVoteOptions.style.display = 'none';
};


const handlePlayerVoteSubmission = (event: any, data: Round, socket: Socket, game: Game) => {
    const clientId = event.target.getAttribute("data-client-id");
    hideRoundResultsSectionVoteOptions();

    const textElement = document.createElement('p');
    const text = document.createTextNode('waiting for other players to vote....');
    textElement.appendChild(text);
  
    roundResultsSection.appendChild(textElement);

    const playerVote: VotingPlayerVote = {
        gameId: game.getGameId(),
        round: data,
        player: game.getPlayer(),
        host: game.getHost(),
        vote: {
            playerVoteFor: clientId,
        },
    };

    socket.emit(VOTING_PLAYER_VOTE,  playerVote);
};

const submitPlayerVote = (data: Round, socket: Socket, game: Game) => {
    const playerRoastCaptions = document.querySelectorAll('.round-results_caption');

    for (let i = 0; i < playerRoastCaptions.length; i++) {
        const roastCaption = playerRoastCaptions[i];
        roastCaption.addEventListener("click", (event: any) => handlePlayerVoteSubmission(event, data, socket, game));

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

export const initialisePlayerVoteSubmission = (data: Round, game: Game, socket: Socket) => {
    submitPlayerVote(data, socket, game);

    socket.on(VOTING_SUBMITTED_PLAYER_VOTE, (data: VotingPlayerVote) => onSubmittedPlayerVote(data, game));
};
