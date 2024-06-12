import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../state/AuthContext';
import API from '../API.mjs';
import { Image, Card, Container } from 'react-bootstrap';
import styles from './GameComponent.module.css';
import Caption from './Caption';

const GameComponent = () => {
  const [round, setRound] = useState(1);
  const [captions, setCaptions] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const {loggedIn} = useContext(AuthContext);

  /*const [meme, setMeme] = useState(null);*/
  const [score, setScore] = useState(0);
  const totalRounds = loggedIn ? 3 : 1;

  const getMeme = async () => {
    try {
      const meme = await API.getRandomMeme();
      //console.log(meme);
      setImageUrl(meme.imageUrl);

      // Combine suitable and unsuitable captions and shuffle them
      const allCaptions = [
        ...meme.suitableCaptions.map(c => ({ text: c.caption, isSuitable: true })),
        ...meme.unsuitableCaptions.map(c => ({ text: c.caption, isSuitable: false }))
      ];
      setCaptions(allCaptions);

    } catch (error) {
      console.error("Failed to fetch meme:", error);
    }
  };

  useEffect(() => {
    getMeme();
  }, [round]);

  const handleCaptionClick = (caption) => {
    console.log(`Selected caption: ${caption.text}`);
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
      alert('Game Ended! Your score is: ' + score);
      
    }
    console.log(`Round: ${round}`);
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
                text={caption.text}
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
