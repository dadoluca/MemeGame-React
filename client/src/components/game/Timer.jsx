import React, { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import styles from './Timer.module.css';

const Timer = ({ duration, onTimeUp, round, gameOver }) => {
  const [key, setKey] = useState(0);

  // When the round changes, reset the timer
  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [round]);

  return (
    <div className={styles.timer}>
      <CountdownCircleTimer
        key={key}
        isPlaying={!gameOver}
        duration={duration}
        colors={['#212529', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[duration, duration * 0.45, duration * 0.10, 0]}
        onComplete={onTimeUp}
      >
        {({ remainingTime }) => (
          <div className={styles.timeLeft}>
            {remainingTime}s
          </div>
        )}
      </CountdownCircleTimer>
    </div>
  );
};

export default Timer;
