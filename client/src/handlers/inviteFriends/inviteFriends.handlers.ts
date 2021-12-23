import { Game } from '../../common/Game';
import { linkGenerator, handleCopyLinkClick } from '../../helpers/game.helpers';

const inviteFriendsSection: HTMLElement = document.querySelector('.invite-friends');
const inviteFriendsSectionLink: HTMLElement= document.querySelector('.invite-friends__link');
const inviteFriendsSectionCopyBtn: HTMLElement = document.querySelector('.invite-friends__copyBtn');

const showInviteFriendsSection = (): void => {
    inviteFriendsSection.style.display = 'block';
};
  
const hideInviteFriendsSection = (): void => {
    inviteFriendsSection.style.display = 'none';
};

const addInviteFriendsLink = (gameId: string): void => {
    showInviteFriendsSection();
    const joinLink = linkGenerator(window.location, gameId)
    inviteFriendsSectionLink.textContent = joinLink;
    inviteFriendsSectionCopyBtn.setAttribute('data-copy-link', joinLink);
    inviteFriendsSectionCopyBtn.addEventListener('click', handleCopyLinkClick);
};

export const initialiseInviteFriends = (game: Game) => {
    const gameId = game.getGameId();
    addInviteFriendsLink(gameId);
};
