import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/game');
  };

  return (
    <Container className={styles.container}>
      <Row className="justify-content-md-center">
        <Col md="8">
          <Card className={styles.card}>
            <Card.Body>
              <Card.Title className={styles.title}>Welcome to the Meme Game!</Card.Title>
              <Card.Text className={styles.description}>
                The goal of the game is to match the correct caption to a randomly selected meme image.
                You will be presented with several captions, but only a couple are suitable.
                Click on the caption you think is correct and see if you can guess them all!
              </Card.Text>
              <Button 
                variant="primary" 
                size="lg" 
                className={styles.playButton} 
                onClick={handlePlayClick}
              >
                PLAY
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
    