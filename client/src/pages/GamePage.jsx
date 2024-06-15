import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../state/AuthContext';
import GameComponent from '../components/GameComponent';
import GameInfo from '../components/GameInfo';
import Timer from '../components/Timer';
import EndGameModal from '../components/EndGameModal';
import API from '../API.mjs';
import styles from './GamePage.module.css';

function GamePage() {
    const { loggedIn } = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [captions, setCaptions] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [gameOver, setGameOver] = useState(false);

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
            setImageUrl(meme.imageUrl);

            const allCaptions = shuffleArray([
                ...meme.suitableCaptions.map(c => ({ text: c.caption, isSuitable: true })),
                ...meme.unsuitableCaptions.map(c => ({ text: c.caption, isSuitable: false }))
            ]);
            setCaptions(allCaptions);
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => { //fetch a new random meme when the round changes
        getMeme();
    }, [round]);

    const handleCaptionClick = (caption) => {
        if (caption.isSuitable) {
            alert('Correct!');
            setScore((prevScore) => prevScore + 5);
        } else {
            alert('Incorrect!');
        }

        increaseRound();
    };

    const increaseRound = () => {
        if (round < totalRounds) {
            setRound((prevRound) => prevRound + 1);
        } else {
            setGameOver(true);
        }
    };

    const handleCloseModal = () => {
        setGameOver(false);
    };

    const handleRematch = () => {
        setGameOver(false);
        setScore(0);
        setRound(1);
        setT
    };

    return (
        <div className={styles.gamePage}>
            <div className={styles.gameContent}>
                <h1 style={{marginBottom: "20px"}}>What do you meme?</h1>
                <GameInfo round={round} totalRounds={totalRounds} score={score} />
                <Timer duration={30} onTimeUp={increaseRound}  round={round} gameOver={gameOver}/>
                <GameComponent 
                    imageUrl={imageUrl} 
                    captions={captions} 
                    onCaptionClick={handleCaptionClick}
                />
            </div>
            <EndGameModal show={gameOver} score={score} onClose={handleCloseModal} onRematch={handleRematch} />
        </div>
    );
}

export default GamePage;
