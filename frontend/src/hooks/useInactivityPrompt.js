import { useState, useEffect, useRef } from 'react';

const useInactivityPrompt = (timeoutMs = 120000) => { // 2 minutes
  const [showPrompt, setShowPrompt] = useState(false);
  const timeoutRef = useRef(null);
  const isFirstVisit = useRef(true);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isFirstVisit.current) {
      timeoutRef.current = setTimeout(() => {
        setShowPrompt(true);
        isFirstVisit.current = false;
      }, timeoutMs);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    isFirstVisit.current = false;
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimerHandler = () => resetTimer();
    
    events.forEach(event => {
      document.addEventListener(event, resetTimerHandler, true);
    });

    resetTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimerHandler, true);
      });
    };
  }, [timeoutMs]);

  return { showPrompt, dismissPrompt };
};

export default useInactivityPrompt;