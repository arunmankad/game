import { LetterStatus } from '../types';

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export const SOLUTIONS = [
  "WORLD", "HELLO", "REACT", "GREAT", "PARTY", "STYLE", "CLONE", "GUESS", "HAPPY", "GAMES"
];

export const VALID_GUESSES = [
  ...SOLUTIONS,
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW", "ALONE",
  "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE", "APPLY", "ARENA",
  "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AUDIO", "AUDIT", "AVOID", "AWARD", "AWARE",
  "BADLY", "BAKER", "BASES", "BASIC", "BASIS", "BEACH", "BEGAN", "BEGIN", "BEGUN", "BEING",
  "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK", "BLAME", "BLIND", "BLOCK", "BLOOD", "BOARD",
  "BOOST", "BOOTH", "BOUND", "BRAIN", "BRAND", "BREAD", "BREAK", "BREED", "BRIEF", "BRING",
  "BROAD", "BROKE", "BROWN", "BUILD", "BUILT", "BUYER", "CABLE", "CALIF", "CARRY", "CATCH",
];

// FIX: Implemented and exported missing game logic functions to resolve import errors.
export const getNewWord = (): string => {
  const randomIndex = Math.floor(Math.random() * SOLUTIONS.length);
  return SOLUTIONS[randomIndex];
};

export const isValidGuess = (guess: string): boolean => {
  return VALID_GUESSES.includes(guess);
};

export const getGuessStatuses = (guess: string, solution: string): LetterStatus[] => {
  const statuses: LetterStatus[] = Array(WORD_LENGTH).fill(LetterStatus.Absent);
  const solutionLetters = solution.split('');
  const guessLetters = guess.split('');

  const letterCounts: { [key: string]: number } = {};
  solutionLetters.forEach(letter => {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  });

  // First pass for correct letters
  guessLetters.forEach((letter, index) => {
    if (letter === solutionLetters[index]) {
      statuses[index] = LetterStatus.Correct;
      letterCounts[letter]--;
    }
  });

  // Second pass for present letters
  guessLetters.forEach((letter, index) => {
    if (statuses[index] !== LetterStatus.Correct) {
      if (letterCounts[letter] > 0) {
        statuses[index] = LetterStatus.Present;
        letterCounts[letter]--;
      }
    }
  });

  return statuses;
};
