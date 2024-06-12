import React from 'react';
import styles from './Caption.module.css';

const Caption = ({ text, onClick }) => {
  return (
    <div className={styles.caption} onClick={onClick}>
      {text}
    </div>
  );
};

export default Caption;
