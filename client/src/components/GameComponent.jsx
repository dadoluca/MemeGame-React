import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../state/AuthContext';
import  API  from '../API.mjs';
import { Image, Card, Container, Row, Col } from 'react-bootstrap';
import styles from './GameComponent.module.css';
import Caption from './Caption';

const GameComponent = () => {
  const [round, setRound] = useState(1);
  const [captions, setCaptions] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  /*const [meme, setMeme] = useState(null);
  const [score, setScore] = useState(0);
  const totalRounds = loggedIn ? 3 : 1;*/

  const getMeme = async() => {
    const meme = await API.getRandomMeme();
    setImageUrl(meme.imageUrl);
    setCaptions([
      "Caption 1",
      "Caption 2",
      "Caption 3",
      "Caption 4",
      "Caption 5",
      "Caption 6",
      "Caption 7"
    ]); // example captions
  }

  useEffect(() => { 
    getMeme();
  }, [round]);

  const handleCaptionClick = (caption) => {
    console.log(`Selected caption: ${caption}`);
    // logic to handle caption selection
  };

  return (
    <Container className={styles.container}>
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
                text={caption}
                onClick={() => handleCaptionClick(caption)}
              />
            ))}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );

};

export default GameComponent;
