import WORDS5 from './words5.json';

export const WORDS = WORDS5;

export function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export function isValidWord(word: string): boolean {
  return WORDS.includes(word.toLowerCase());
}

