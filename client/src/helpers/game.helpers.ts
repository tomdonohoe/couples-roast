import { v4 as uuidv4 } from 'uuid';

export const generateGameId = (): string => {
  return uuidv4();
};

export const getGameIdFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('gameId');
};

export const isGuest = (): boolean => {
  const queryGameId = getGameIdFromUrl();
  return Boolean(queryGameId);
};

export const isHost = (): boolean => {
  const queryGameId = getGameIdFromUrl();
  return !Boolean(queryGameId);
};

export const linkGenerator = (windowLocation: Location, gameId: string) => {
  return `${windowLocation.protocol}//${windowLocation.host}${windowLocation.pathname}?gameId=${gameId}`;
};

export const handleCopyLinkClick = (event: any) => {
  const link = event.target.getAttribute('data-copy-link');

  if (!link) {
    return;
  }

  navigator.clipboard.writeText(link);
};

export const sleepForSeconds = (seconds: number) => {
  const ms = seconds * 1000;
  return new Promise(resolve => setTimeout(resolve, ms));
};
