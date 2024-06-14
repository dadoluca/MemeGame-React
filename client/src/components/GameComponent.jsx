import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../state/AuthContext';
import API from '../API.mjs';
import { Image, Card, Container, Row, Col } from 'react-bootstrap';
import styles from './GameComponent.module.css';
import Caption from './Caption';
import EndGameModal from './EndGameModal';

const GameComponent = ({score, setScore, round, setRound}) => {
  const [captions, setCaptions] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const {loggedIn} = useContext(AuthContext);

  const totalRounds = loggedIn ? 3 : 1;

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const getMeme = async () => {
    try {
      const meme = await API.getRandomMeme();
      //console.log(meme);
      setImageUrl(meme.imageUrl);

      // Combine suitable and unsuitable captions and shuffle them
      const allCaptions = shuffleArray([
        ...meme.suitableCaptions.map(c => ({  text: c.caption, isSuitable: true })),
        ...meme.unsuitableCaptions.map(c => ({  text: c.caption, isSuitable: false }))
      ]);
      setCaptions(allCaptions);

    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getMeme();
  }, [round]);

  const handleCaptionClick = (caption) => {
    //console.log(`Selected caption: ${caption.text}`);
    if (caption.isSuitable) {
      alert('Correct!');
      setScore((prevScore) => prevScore + 5);
      
    } else {
      alert('Incorrect!');
    }
    // Logic to handle caption selection and proceed to next round
    if(round < totalRounds) {
      setRound((prevRound) => prevRound + 1);
    }
    else {
      setGameOver(true);
    }
    console.log(`Round: ${round}, Score: ${score}`);
  };

  const handleCloseModal = () => {
    setGameOver(false);
  };

  const handleRematch = () => {
    setGameOver(false);
    setScore(0);
    setRound(1);
  };

  return (
    <Container className={styles.container}>
      <Row className="justify-content-md-center">
        <Col md="8">
          <Card className={styles.card}>
            <Card.Body>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Random Meme"
                  fluid
                  className={styles.image}
                />
              )}
              <div className={styles.captions}>
                {captions.map((caption, index) => (
                  <Caption
                    key={index}
                    caption={caption}
                    onClick={handleCaptionClick}
                    //onClick={() => handleCaptionClick(caption)}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <EndGameModal show={gameOver} score={score} onClose={handleCloseModal} onRematch={handleRematch} />
    </Container>
  );
};

export default GameComponent;
