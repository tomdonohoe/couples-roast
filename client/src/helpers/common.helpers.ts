import { GameResults } from '../types/result.types';
import { RoundResults } from '../types/round.types';

export const sleepForSeconds = (seconds: number) => {
  const ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const sortResultsDescending = (
  results: RoundResults[] | GameResults[],
): RoundResults[] | GameResults[] => {
  return results.sort((a, b) => b.points - a.points);
};
