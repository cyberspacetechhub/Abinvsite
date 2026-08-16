import React, { useState } from 'react';
import { Warning, Lock, Security } from '@mui/icons-material';
import AccountUnlock from './AccountUnlock';

const LoginAttempts = ({ attempts, lockUntil, userEmail }) => {
  const [showUnlock, setShowUnlock] = useState(false);
  const maxAttempts = 5;
  const remainingAttempts = maxAttempts - (attempts || 0);
  const isLocked = lockUntil && new Date(lockUntil) > new Date();

  if (attempts === 0 || !attempts) return null;

  if (showUnlock) {
    return (
      <AccountUnlock 
        userEmail={userEmail}
        onSuccess={() => {
          setShowUnlock(false);
          window.location.reload();
        }}
        onBack={() => setShowUnlock(false)}
      />
    );
  }

  return (
    <div className={`p-3 rounded-lg mb-4 ${
      isLocked 
        ? 'bg-red-100 border border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
        : 'bg-yellow-100 border border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Warning className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {isLocked ? (
              `Account locked until ${new Date(lockUntil).toLocaleString()}`
            ) : (
              `${remainingAttempts} login attempt${remainingAttempts !== 1 ? 's' : ''} remaining`
            )}
          </span>
        </div>
        {isLocked && (
          <button
            onClick={() => setShowUnlock(true)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            <Security className="w-3 h-3" />
            Unlock Account
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginAttempts;