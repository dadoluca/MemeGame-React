import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../state/AuthContext';
import { Image } from 'react-bootstrap';
//import { API } from '../API.mjs';

const GameComponent = () => {
  /*const [round, setRound] = useState(1);
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [score, setScore] = useState(0);
  const totalRounds = loggedIn ? 3 : 1;*/
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => { //TODO metterlo in API.mjs
    fetch('http://localhost:3001/api/memes/random')
      .then(response => response.json())
      .then(data => setImageUrl(data.imageUrl))
      .catch(error => console.error('Error fetching meme:', error));
  }, []);

  return (
    <div>
        {imageUrl && <Image src={imageUrl} alt="Random Meme" fluid />}
    </div>
  );
};

export default GameComponent;
