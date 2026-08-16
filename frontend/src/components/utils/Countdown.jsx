import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate, onComplete, label }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (Object.keys(newTimeLeft).length === 0 && onComplete) {
        onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (time) => {
    if (Object.keys(time).length === 0) {
      return "00:00:00";
    }

    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = time;
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isExpired = Object.keys(timeLeft).length === 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}:</span>
      <span className={`font-mono text-sm font-medium ${
        isExpired ? 'text-red-500' : 'text-gray-900 dark:text-white'
      }`}>
        {isExpired ? 'EXPIRED' : formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Countdown;