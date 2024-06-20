import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import GameComponent from '../../components/game/GameComponent';
import GameInfo from '../../components/game/GameInfo';
import Timer from '../../components/game/Timer';
import EndGameModal from '../../components/game/modals/EndGameModal';
import WrongChoiceModal from '../../components/game/modals/WrongChoiceModal';
import API from '../../services/API.mjs';
import styles from './GamePage.module.css';

const GameState = {
    LOADING: 'loading',
    PLAYING: 'playing',
    SHOW_WRONG_CHOICE: 'show_wrong_choice',
    SHOW_TIME_OUT: 'show_time_out',
    GAME_OVER: 'game_over',
};

function GamePage() {
    const { loggedIn } = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [memes, setMemes] = useState([]);//1 to 3 memes based on user login
    const [gameState, setGameState] = useState(GameState.LOADING);
    const [correctCaptionsIds, setCorrectCaptionsIds] = useState([]);//to show in wrong choice modal
    const [matchedMemes, setMatchedMemes] = useState([]);//to show in end game modal

    const totalRounds = loggedIn ? 3 : 1;
    console.log('totalRounds', totalRounds);

    const getMemes = async () => {
        try {
            const memes = await API.getRandomMemes();
            setMemes(memes);
            setGameState(GameState.PLAYING); // Set state to PLAYING after memes are loaded
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMemes();
    }, []);

    const handleCaptionClick = async (caption) => {
        const meme = memes[round];
        const currentMemeCaptionsIds = meme.captions.map(c => c.id);
        const response = await API.verifyCaptionCorrectness(meme.id, caption.id, currentMemeCaptionsIds);
        if (response.isSuitable) {
            setScore(prevScore => prevScore + 5);
            setCorrectCaptionsIds([]);
            setMatchedMemes(prevMatchedMemes => [...prevMatchedMemes, { meme, caption }]); // Aggiungi il meme corretto al riepilogo
            increaseRound();
        } else {
            setCorrectCaptionsIds(response.suitableCaptions);
            setGameState(GameState.SHOW_WRONG_CHOICE);
        }
    };

    const increaseRound = () => {
        if (round + 1 < totalRounds) {
            setRound(prevRound => prevRound + 1);
            setGameState(GameState.PLAYING);
        } else {
            setGameState(GameState.GAME_OVER);
        }
    };

    const handleTimeUp = () => {
        setCorrectCaptionsIds(memes[round].captions.map(c => c.id));
        setGameState(GameState.SHOW_TIME_OUT);
    };

    const handleCloseWrongChoiceModal = () => {
        setCorrectCaptionsIds([]);
        increaseRound();
    };

    const handleCloseEndModal = () => {
        console.log('game over');
    };

    const handleRematch = () => {
        setScore(0);
        setRound(0);
        setMatchedMemes([]); // Resetta il riepilogo dei meme corretti
        getMemes();
    };
    console.log(gameState, round, totalRounds,memes);
    return (
        <div className={styles.gamePage}>
            {gameState === GameState.LOADING ? (
                <p>Loading...</p>
            ) : (
                <>                  
                    <div className={styles.gameContent}>
                        <h1 style={{ marginBottom: "20px" }}>What do you meme?</h1>
                        <GameInfo round={round} totalRounds={totalRounds} score={score} />
                        <Timer duration={30} onTimeUp={handleTimeUp} round={round} gameOver={gameState === GameState.GAME_OVER} />
                        <GameComponent
                            imageUrl={memes[round].imageUrl}
                            captions={memes[round].captions}
                            onCaptionClick={handleCaptionClick}
                        />
                    </div>

                    <WrongChoiceModal
                        show={gameState === GameState.SHOW_WRONG_CHOICE || gameState === GameState.SHOW_TIME_OUT}
                        onClose={handleCloseWrongChoiceModal}
                        correctCaptions={memes[round]?.captions.filter(c => correctCaptionsIds.includes(c.id))}
                    />
                    <EndGameModal 
                        show={gameState === GameState.GAME_OVER} 
                        score={score} 
                        onClose={handleCloseEndModal} 
                        onRematch={handleRematch}
                        matchedMemes={matchedMemes} 
                    />
                </>
            )}
        </div>
    );
}

export default GamePage;
