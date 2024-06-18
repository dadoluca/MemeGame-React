import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import styles from './EndGameModal.module.css';
import { AuthContext } from '../../../contexts/AuthContext';
import {useContext } from 'react';
const EndGameModal = ({ show, score, onClose, onRematch }) => {
  const { loggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  const handleRematch = () => {
    onRematch();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <h2>Your Score: {score}</h2>
        <p>Thank you for playing!</p>
        { !loggedIn && <p>Please log in for the full version of the game</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Back to Home
        </Button>
        { loggedIn &&
        <Button variant="success" onClick={handleRematch}>
          Play Again
        </Button>}
      </Modal.Footer>
    </Modal>
  );
};

export default EndGameModal;
