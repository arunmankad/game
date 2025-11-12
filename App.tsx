import React, { useState, useEffect, useCallback } from 'react';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { Toast } from './components/Toast';
import { getNewWord, isValidGuess, getGuessStatuses, WORD_LENGTH, MAX_GUESSES, SOLUTIONS } from './services/gameService';
import { LetterStatus } from './types';

const App: React.FC = () => {
  const [solution, setSolution] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [shakeCurrentRow, setShakeCurrentRow] = useState<boolean>(false);
  const [keyStatuses, setKeyStatuses] = useState<{ [key: string]: LetterStatus }>({});

  const startNewGame = useCallback(() => {
    setSolution(getNewWord());
    setGuesses([]);
    setCurrentGuess('');
    setIsGameOver(false);
    setToastMessage('');
    setKeyStatuses({});
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleKeyPress = useCallback((key: string) => {
    if (isGameOver) return;

    if (key === 'Enter') {
      if (currentGuess.length !== WORD_LENGTH) {
        setShakeCurrentRow(true);
        showToast('Not enough letters');
        setTimeout(() => setShakeCurrentRow(false), 500);
        return;
      }

      if (!isValidGuess(currentGuess)) {
        setShakeCurrentRow(true);
        showToast('Not in word list');
        setTimeout(() => setShakeCurrentRow(false), 500);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      
      // Update key statuses
      const newKeyStatuses = {...keyStatuses};
      const statuses = getGuessStatuses(currentGuess, solution);
      currentGuess.split('').forEach((letter, i) => {
        const currentStatus = newKeyStatuses[letter];
        const newStatus = statuses[i];
        if (currentStatus === undefined || newStatus > currentStatus) {
            newKeyStatuses[letter] = newStatus;
        }
      });
      setKeyStatuses(newKeyStatuses);


      setCurrentGuess('');

      if (currentGuess === solution) {
        showToast('You won!');
        setIsGameOver(true);
      } else if (newGuesses.length === MAX_GUESSES) {
        showToast(`You lost! The word was ${solution}`);
        setIsGameOver(true);
      }
    } else if (key === 'Backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + key);
    }
  }, [currentGuess, guesses, isGameOver, solution, keyStatuses]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let key = event.key.toUpperCase();
      if (key === 'BACKSPACE') key = 'Backspace';
      if (key === 'ENTER') key = 'Enter';
      handleKeyPress(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-2 md:p-4">
      <header className="text-center border-b-2 border-gray-700 pb-2 mb-4 w-full max-w-md">
        <h1 className="text-4xl font-bold tracking-wider">WORDLE</h1>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center w-full">
        {toastMessage && <Toast message={toastMessage} onHide={() => setToastMessage('')} />}
        {solution && <Grid
          guesses={guesses}
          currentGuess={currentGuess}
          solution={solution}
          shakeCurrentRow={shakeCurrentRow}
        />}
        {isGameOver && (
          <button
            onClick={startNewGame}
            className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-white font-bold text-lg transition-colors"
          >
            Play Again
          </button>
        )}
      </main>

      <div className="w-full max-w-lg lg:max-w-xl">
        <Keyboard onKeyPress={handleKeyPress} keyStatuses={keyStatuses} />
      </div>
    </div>
  );
};

export default App;
