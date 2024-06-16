import React from 'react';
import { Card } from 'react-bootstrap';
import styles from './GameInfo.module.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../state/AuthContext';
const GameInfo = ({ round, totalRounds, score }) => {
    const {loggedIn, user } = useContext(AuthContext);
  return (
    <Card className={styles.gameInfo}>
      <Card.Body>
        <Card.Title>Game Info</Card.Title>
        <Card.Text>Player: {loggedIn ? user.name : "Not Logged"}</Card.Text>
        <Card.Text>Round: {round}/{totalRounds}</Card.Text>
        <Card.Text>Score: {score}/{totalRounds * 5}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default GameInfo;
