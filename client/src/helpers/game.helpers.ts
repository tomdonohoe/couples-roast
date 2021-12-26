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

export const generateRandomHexColor = (size: number): string => {
  let result = [];
  const hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  for (let n = 0; n < size; n++) {
    result.push(hexRef[Math.floor(Math.random() * 16)]);
  }

  return result.join('');
};
