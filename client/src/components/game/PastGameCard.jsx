import React from 'react';
import { Image, Card, Container, Row, Col } from 'react-bootstrap';
import styles from './PastGameCard.module.css';

function PastGameCard({ game }) {
  return (
    <Container className="my-3">
      <Card className={styles.card}>
        <Card.Header className={styles.cardHeader}>
          <h6>{new Date(game.date).toLocaleDateString()}</h6>
          <h5>Total Score: {game.totalScore}</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {game.rounds.map((round) => (
              <Col key={round.roundNumber} md={4} className="text-center">
                <div className={styles.roundInfo}>
                  <h6>Round {round.roundNumber}</h6>
                  <Image
                    src={round.imageUrl}
                    alt="Meme"
                    fluid
                    className={`${styles.image} ${round.score === 5 ? styles.greenBorder : styles.redBorder}`}
                  />
                  <span className={`${styles.score} ${round.score === 5 ? styles.greenScore : styles.redScore}`}>
                    {round.score} points
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PastGameCard;
