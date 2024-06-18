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
    else if(!gameOver){
      const timerId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft,gameOver]);

  //when round changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [round]);


  const timerSize = 60 -timeLeft/2;
  const timerColor = timeLeft <= 5 ? 'red' : timeLeft <= 15 ? 'orange' : '#007bff';
    return (
      <div className={styles.timer}>
        <FaClock size={timerSize} className={styles.icon} style={{color: timerColor}} /> 
        <span className={styles.timeLeft} style={{color: timerColor, fontSize: (timerSize-8)+'px'}}>{timeLeft}s</span>
      </div>
    );
};

export default Timer;
