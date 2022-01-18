import { Game } from '../../../common/Game';
import { sleepForSeconds } from '../../../helpers/common.helpers';
import { Round } from '../../../types/round.types';
import {
  hideRoundSection,
  showRoundSection,
} from '../roundStarted/roundStarted.handlers';

const roundCaptionSummary: HTMLElement = document.querySelector(
  '.round-caption-summary',
);
const roundCaptionSummaryImage: HTMLImageElement = document.querySelector(
  '.round-caption-summary__image',
);
const roundCaptionSummaryImagePhotographer: HTMLElement =
  document.querySelector('.round-caption-summary__imageMetaPhotographer');
const roundCaptionSummaryImageMetaPexelsLink: HTMLAnchorElement =
  document.querySelector('.round-caption-summary__imageMetaPexelsLink');
const roundCaptionSummaryCaption: HTMLElement = document.querySelector(
  '.round-caption-summary__caption',
);

const showRoundCaptionSummary = (): void => {
  roundCaptionSummary.style.display = 'block';
};

const hideRoundCaptionSummary = (): void => {
  roundCaptionSummary.style.display = 'none';
};

const addRoundCaptionSummary = async (data: Round): Promise<void> => {
  hideRoundSection();
  showRoundCaptionSummary();

  const { photo } = data;
  roundCaptionSummaryImage.src = photo.src.landscape;
  roundCaptionSummaryImagePhotographer.textContent = photo.photographer;
  roundCaptionSummaryImageMetaPexelsLink.href = photo.url;
  const captions = data.captions;

  for (const caption of captions) {
    // add caption
    roundCaptionSummaryCaption.textContent = caption.caption;
    // wait 5 seconds
    await sleepForSeconds(5);
  }

  hideRoundCaptionSummary();
  showRoundSection();
};

export const initialisePlayerRoastCaptionSummary = async (game: Game) => {
  const { rounds } = game.getGameState();
  const currentRound = rounds[rounds.length - 1];
  await addRoundCaptionSummary(currentRound);
};
