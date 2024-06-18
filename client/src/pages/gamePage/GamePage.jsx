import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import GameComponent from '../../components/game/GameComponent';
import GameInfo from '../../components/game/GameInfo';
import Timer from '../../components/game/Timer';
import EndGameModal from '../../components/game/modals/EndGameModal';
import WrongChoiceModal from '../../components/game/modals/WrongChoiceModal';
import API from '../../services/API.mjs';
import styles from './GamePage.module.css';

function GamePage() {
    const { loggedIn } = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [memes, setMemes] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [correctCaptionsIds, setCorrectCaptionsIds] = useState([]);
    const [loading, setLoading] = useState(true); 

    const totalRounds = loggedIn ? 3 : 1;

    const getMemes = async () => {
        try {
            const memes = await API.getRandomMemes();
            setMemes(memes);
            setLoading(false); //loading finished
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        getMemes();
    }, []);


    const handleCaptionClick = async (caption) => {
        const meme = memes[round];
        const currentMemeCaptionsIds = meme.captions.map(c => c.id)
        const response = await API.verifyCaptionCorrectness(meme.id, caption.id, currentMemeCaptionsIds);
        if (response.isSuitable) {//correct choice
            setScore(prevScore => prevScore + 5);
            setCorrectCaptionsIds([]);
            increaseRound();
        } else {//wrong choice
            setCorrectCaptionsIds(response.suitableCaptions);
        }
    };

    const increaseRound = () => {
        if ((round +1) < totalRounds) {
            console.log(round)+"INCEREASE";
            setRound(prevRound => prevRound + 1);
        } else {
            console.log(round+"FINE");
            setGameOver(true);
        }
    };

    const handleCloseWrongChoiceModal = () => {
        setCorrectCaptionsIds([]);
        increaseRound();
    };

    const handleCloseEndModal = () => {
        setGameOver(false);
    };

    const handleRematch = () => {
        setGameOver(false);
        setScore(0);
        setRound(0);
    };


    console.log(loading,memes);
    return (
        loading ? <p>Loading...</p> :
        <div className={styles.gamePage}>
         {memes[round] &&
            <>
            <div className={styles.gameContent}>
                <h1 style={{ marginBottom: "20px" }}>What do you meme?</h1>
                <GameInfo round={round} totalRounds={totalRounds} score={score} />
                <Timer duration={30} onTimeUp={increaseRound} round={round} gameOver={gameOver} />
                <GameComponent
                    imageUrl={memes[round].imageUrl}
                    captions={memes[round].captions}
                    onCaptionClick={handleCaptionClick}
                />
                
            </div>
        
            <WrongChoiceModal
                show={correctCaptionsIds.length > 0 }
                onClose={handleCloseWrongChoiceModal}
                correctCaptions={ memes[round].captions.filter(c => correctCaptionsIds.includes(c.id))}
            />
            </>
        }
            <EndGameModal show={gameOver} score={score} onClose={handleCloseEndModal} onRematch={handleRematch} />
        </div>
    );
}

export default GamePage;
