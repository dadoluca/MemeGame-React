import React from 'react';
import { Modal } from 'react-bootstrap';
import styles from './CorrectChoiceModal.module.css';

const CorrectChoiceModal = ({ show, onClose }) => {
   return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header >
        <Modal.Title>Correct Choice!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className={styles.points}>+ 5 points</p>
      </Modal.Body>
    </Modal>
  );
};

export default CorrectChoiceModal;
