
import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onHide, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onHide, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onHide]);

  return (
    <div
      aria-live="assertive"
      className={`fixed top-[12%] left-1/2 -translate-x-1/2 px-6 py-3 rounded-md text-white font-bold text-lg z-50 transition-all duration-300 pointer-events-none
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}
        bg-black bg-opacity-70 shadow-lg`}
    >
      {message}
    </div>
  );
};
