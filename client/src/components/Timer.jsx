import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import styles from './Timer.module.css';

const Timer = ({duration, onTimeUp, round, gameOver}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  const handleTimeUp = () => {
    onTimeUp();
  }

  //every 1 second
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  //when round changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [round]);

  //when game is over
  useEffect(() => {
    if (gameOver) {
      setTimeLeft(0);
    }
  }, [gameOver]);

  return (
    <div className={styles.timer}>
      <FaClock size={24} />
      <span>{timeLeft}s</span>
    </div>
  );
};

export default Timer;
