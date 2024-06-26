import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './EndGameModal.module.css';
import { AuthContext } from '../../../contexts/AuthContext';
import { useContext } from 'react';

const EndGameModal = ({ show, score, onClose, onRematch, correctMatchesMemes }) => {
  const { loggedIn } = useContext(AuthContext);

  const handleClose = () => {
    onClose();
  };

  const handleRematch = () => {
    onRematch();
  };

  const getModalWidthClass = (count) => {
    if (count === 2) return styles.modalWidthTwo;
    if (count === 3) return styles.modalWidthThree;
    return styles.modalWidthOne;
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName={`${styles.customModalWidth} ${getModalWidthClass(correctMatchesMemes.length)}`}>
      <Modal.Header closeButton>
        <Modal.Title>Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {loggedIn ? (
          <>
            <h2>Your Score: {score} / 15</h2>
            { correctMatchesMemes.length > 0 ? <h3>Summary of Correct Matches:</h3> : <h3>You suck, play something else.</h3>}
            <div className={styles.matchedMemesGrid}>
              {correctMatchesMemes.map((match, index) => (
                <div key={index} className={styles.matchedMemeItem}>
                  <img src={match.meme.imageUrl} alt="Meme" className={styles.summaryImage} />
                  <div className={styles.smallCaption}>{match.caption.caption}</div>
                </div>
              ))}
            </div>
          </>
        )
        : (   
          <>   
            <h3>Thank you for playing!</h3>
            <p>Please log in for the full version of the game</p>
          </>   
        )}
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button variant="primary" onClick={handleClose} className={styles.button}>
          Back to Home
        </Button>
        {loggedIn && (
          <Button variant="success" onClick={handleRematch} className={styles.button}>
            Play Again
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EndGameModal;
