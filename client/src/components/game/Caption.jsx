import React from 'react';
import styles from './Caption.module.css';



const Caption = ({ caption, onClick }) => {
  const handleClick = () => {
    onClick(caption);
  };
  return (
    <button className={styles.caption} onClick={handleClick}>
      {caption.caption}
    </button>
  );
};

export default Caption;
