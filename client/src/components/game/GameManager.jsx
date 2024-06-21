import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import MemeCard from './MemeCard';
import GameInfo from '../../components/game/GameInfo';
import Timer from '../../components/game/Timer';
import EndGameModal from '../../components/game/modals/EndGameModal';
import WrongChoiceModal from '../../components/game/modals/WrongChoiceModal';
import styles from './GameManager.module.css';
import API from '../../services/API.mjs';
import { useNavigate } from 'react-router-dom';

const GameState = {
    PLAYING: 'playing',
    SHOW_WRONG_CHOICE: 'show_wrong_choice',
    SHOW_TIME_OUT: 'show_time_out',
    GAME_OVER: 'game_over',
};

const GameManager = ({ memes }) => {

    const navigate = useNavigate();
    const { loggedIn } = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [gameState, setGameState] = useState(GameState.PLAYING);
    const [correctCaptionsIds, setCorrectCaptionsIds] = useState([]);
    const [matchedMemes, setMatchedMemes] = useState([]);

    const totalRounds = loggedIn ? 3 : 1;

    const handleCaptionClick = async (caption) => {
        const meme = memes[round];
        const currentMemeCaptionsIds = meme.captions.map(c => c.id);
        const response = await API.verifyCaptionCorrectness(meme.id, caption.id, currentMemeCaptionsIds);
        if (response.isSuitable) {
            setScore(prevScore => prevScore + 5);
            setCorrectCaptionsIds([]);
            setMatchedMemes(prevMatchedMemes => [...prevMatchedMemes, { meme, caption }]);
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
        navigate('/');//redirect to home
    };

    const handleRematch = () => {
        navigate(0);//reload current route --> reload memes 
    };

    return (
        <>
            <div className={styles.gameContent}>
                <h1 style={{ marginBottom: "20px" }}>What do you meme?</h1>
                <GameInfo round={round} totalRounds={totalRounds} score={score} />
                <Timer duration={30} onTimeUp={handleTimeUp} round={round} gameOver={gameState === GameState.GAME_OVER} />
                <MemeCard
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
    );
};

export default GameManager;
