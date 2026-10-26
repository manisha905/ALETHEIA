import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [clockText, setClockText] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const utcStr = now.toISOString().replace('T', ' ').substring(0, 19);
      setClockText(`UTC: ${utcStr} | STATUS: ENCRYPTED (VAULT ACTIVE)`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="terminal-clock">
      {clockText || 'UTC: 2026-10-08 18:24:00 | STATUS: ENCRYPTED'}
    </div>
  );
};

export default LiveClock;
