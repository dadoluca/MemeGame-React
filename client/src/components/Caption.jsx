import React from 'react';
import styles from './Caption.module.css';



const Caption = ({ caption, onClick }) => {
  const handleClick = () => {
    onClick(caption);
  };
  return (
    <div className={styles.caption} onClick={handleClick}>
      {caption.caption}
    </div>
  );
};

export default Caption;
