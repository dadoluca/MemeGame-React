import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './WrongChoiceModal.module.css';

const WrongChoiceModal = ({ show, onClose, correctCaptions }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Wrong Choice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You didn't choose the best caption. Here are the correct ones:</p>
        <ul className={styles.captionList}>
          {correctCaptions.map((caption, index) => (
            <li key={index} className={styles.captionItem}>{caption.caption}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WrongChoiceModal;
