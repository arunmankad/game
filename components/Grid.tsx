
import React from 'react';
import { LetterStatus } from '../types';
import { WORD_LENGTH, MAX_GUESSES, getGuessStatuses } from '../services/gameService';

// Tile Component
interface TileProps {
  letter?: string;
  status?: LetterStatus;
  isRevealing?: boolean;
  index?: number;
}

const Tile: React.FC<TileProps> = ({ letter, status = LetterStatus.Default, isRevealing = false, index = 0 }) => {
  const statusClasses = {
    [LetterStatus.Default]: 'border-gray-500',
    [LetterStatus.Absent]: 'bg-gray-700 border-gray-700 text-white',
    [LetterStatus.Present]: 'bg-yellow-500 border-yellow-500 text-white',
    [LetterStatus.Correct]: 'bg-green-600 border-green-600 text-white',
  };

  const frontClasses = `flex items-center justify-center w-full h-full border-2 rounded ${letter && status === LetterStatus.Default ? 'border-gray-400 animate-pop' : 'border-gray-600'}`;
  const backClasses = `flex items-center justify-center w-full h-full rounded absolute top-0 left-0 ${statusClasses[status]} [transform:rotateX(180deg)] [backface-visibility:hidden]`;
  
  const animationDelay = `${index * 100}ms`;

  return (
    <div className={`relative w-14 h-14 md:w-16 md:h-16 text-3xl font-bold uppercase
      ${isRevealing ? 'transition-transform duration-700 [transform-style:preserve-3d]' : ''}
      ${isRevealing ? '[transform:rotateX(180deg)]' : ''}
    `}
    style={{ transitionDelay: animationDelay }}
    >
      <div className={`${frontClasses} [backface-visibility:hidden]`}>{letter}</div>
      <div className={backClasses}>{letter}</div>
    </div>
  );
};

// Row Components
interface CompletedRowProps {
  guess: string;
  solution: string;
}

const CompletedRow: React.FC<CompletedRowProps> = ({ guess, solution }) => {
  const statuses = getGuessStatuses(guess, solution);
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {guess.split('').map((letter, i) => (
        <Tile key={i} letter={letter} status={statuses[i]} isRevealing={true} index={i} />
      ))}
    </div>
  );
};

interface CurrentRowProps {
  guess: string;
  isShaking: boolean;
}

const CurrentRow: React.FC<CurrentRowProps> = ({ guess, isShaking }) => {
  const letters = guess.split('');
  return (
    <div className={`grid grid-cols-5 gap-1.5 ${isShaking ? 'animate-shake' : ''}`}>
      {Array.from(Array(WORD_LENGTH)).map((_, i) => (
        <Tile key={i} letter={letters[i]} />
      ))}
    </div>
  );
};

const EmptyRow: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from(Array(WORD_LENGTH)).map((_, i) => (
        <Tile key={i} />
      ))}
    </div>
  );
};

// Grid Component
interface GridProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  shakeCurrentRow: boolean;
}

export const Grid: React.FC<GridProps> = ({ guesses, currentGuess, solution, shakeCurrentRow }) => {
  const remainingGuesses = MAX_GUESSES - guesses.length - 1;

  return (
    <div className="grid grid-rows-6 gap-1.5">
      {guesses.map((guess, i) => (
        <CompletedRow key={i} guess={guess} solution={solution} />
      ))}
      {guesses.length < MAX_GUESSES && <CurrentRow guess={currentGuess} isShaking={shakeCurrentRow} />}
      {Array.from(Array(remainingGuesses > 0 ? remainingGuesses : 0)).map((_, i) => (
        <EmptyRow key={i} />
      ))}
    </div>
  );
};
