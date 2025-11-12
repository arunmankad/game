
import React from 'react';
import { LetterStatus } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyStatuses: { [key: string]: LetterStatus };
}

interface KeyProps {
  value: string;
  status?: LetterStatus;
  onClick: (value: string) => void;
  isLarge?: boolean;
}

const Key: React.FC<KeyProps> = ({ value, status = LetterStatus.Default, onClick, isLarge = false }) => {
  const statusClasses = {
    [LetterStatus.Default]: 'bg-gray-500 hover:bg-gray-600',
    [LetterStatus.Absent]: 'bg-gray-800 text-gray-400',
    [LetterStatus.Present]: 'bg-yellow-500 text-white',
    [LetterStatus.Correct]: 'bg-green-600 text-white',
  };

  const classes = `
    flex items-center justify-center rounded font-bold uppercase cursor-pointer transition-colors
    h-14
    ${isLarge ? 'text-xs px-2 md:px-3 flex-grow' : 'text-lg flex-1'}
  `;

  return (
    <button className={`${classes} ${statusClasses[status]}`} onClick={() => onClick(value)}>
      {value === 'Backspace' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-4-4m0 0l4-4m-4 4h12" transform="rotate(180 12 12)" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12H3" />
            <path d="M3 6h18v12H3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 10l4 4m0-4l-4 4"/>
          </svg>
      ) : value}
    </button>
  );
};

export const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyStatuses }) => {
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'];

  const getKeyStatus = (key: string): LetterStatus => {
    return keyStatuses[key] ?? LetterStatus.Default;
  };

  return (
    <div className="flex flex-col gap-2 my-2 w-full max-w-lg mx-auto">
      <div className="flex justify-center gap-1.5 w-full">
        {row1.map((key) => (
          <Key key={key} value={key} onClick={onKeyPress} status={getKeyStatus(key)} />
        ))}
      </div>
      <div className="flex justify-center gap-1.5 w-full">
        <div className="flex-[0.5]"></div>
        {row2.map((key) => (
          <Key key={key} value={key} onClick={onKeyPress} status={getKeyStatus(key)} />
        ))}
        <div className="flex-[0.5]"></div>
      </div>
      <div className="flex justify-center gap-1.5 w-full">
        {row3.map((key) => (
          <Key
            key={key}
            value={key}
            onClick={onKeyPress}
            status={getKeyStatus(key)}
            isLarge={key.length > 1}
          />
        ))}
      </div>
    </div>
  );
};
