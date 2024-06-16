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
    const [memes, setMemes] = useState([]);
    const [currentMeme, setCurrentMeme] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const totalRounds = loggedIn ? 3 : 1;

    const getMemes = async () => {
        try {
            const memes = await API.getRandomMemes();
            setMemes(memes);
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => { //fetch a new random meme when the round changes
        getMemes();
    }, []);

    useEffect(() => {
        if (memes.length > 0) {
            setCurrentMeme(memes[round-1]);
        }
    }, [memes, round]);


    const handleCaptionClick = async (caption) => {
        const meme = memes[round - 1];
        const isSuitable = await API.verifyCaptionCorrectness(meme.id, caption.id);
        if (isSuitable) {
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
    };
    
    return (
        <div className={styles.gamePage}>
            <div className={styles.gameContent}>
                <h1 style={{ marginBottom: "20px" }}>What do you meme?</h1>
                <GameInfo round={round} totalRounds={totalRounds} score={score} />
                <Timer duration={30} onTimeUp={increaseRound} round={round} gameOver={gameOver} />
                {currentMeme ? (
                    <GameComponent
                        imageUrl={currentMeme.imageUrl}
                        captions={currentMeme.captions}
                        onCaptionClick={handleCaptionClick}
                    />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <EndGameModal show={gameOver} score={score} onClose={handleCloseModal} onRematch={handleRematch} />
        </div>
    );
}

export default GamePage;
