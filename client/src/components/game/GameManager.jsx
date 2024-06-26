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
import { Toast, ToastContainer } from 'react-bootstrap';

const GameState = {
    PLAYING: 'playing',
    SHOW_WRONG_CHOICE: 'show wrong choice',
    SHOW_TIME_OUT: 'show time out',
    GAME_OVER: 'game over',
};


const GameManager = ({ memes }) => {

    const navigate = useNavigate();
    const { loggedIn } = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [gameState, setGameState] = useState(GameState.PLAYING);
    const [correctCaptionsIds, setCorrectCaptionsIds] = useState([]);
    const [matchedMemes, setMatchedMemes] = useState([]);
    const [showErrorSavingPopup, setShowErrorSavingPopup] = useState(false);

    const totalRounds = loggedIn ? 3 : 1;

    const handleCaptionClick = async (caption) => {
        const meme = memes[round];
        const currentMemeCaptionsIds = meme.captions.map(c => c.id);
        const response = await API.verifyCaptionCorrectness(meme.id, caption.id, currentMemeCaptionsIds);

        setMatchedMemes(prevMatchedMemes =>
             [...prevMatchedMemes, { roundNumber:round, meme, caption, score: response.isSuitable ? 5 : 0 }]);
        if (response.isSuitable) {
            setScore(prevScore => prevScore + 5);
            setCorrectCaptionsIds([]);
            increaseRound();
        } else {
            setCorrectCaptionsIds(response.suitableCaptions);
            setGameState(GameState.SHOW_WRONG_CHOICE);
        }
    };

    const increaseRound = async () => {
        if (round + 1 < totalRounds) {
            setRound(prevRound => prevRound + 1);
            setGameState(GameState.PLAYING);
        } else {
            setGameState(GameState.GAME_OVER);

            if (loggedIn) {
                try {
                    const rounds = matchedMemes.map((round, index) => ({
                        roundNumber: round.roundNumber,
                        memeId: round.meme.id,  
                        score: round.score
                    }));
                    await API.saveGame(score, rounds);
                } catch (error) {
                    console.error("Error saving the game:", error);
                    setShowErrorSavingPopup(true);
                } 
            }
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

    const handleCloseEndModal =  () => {
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
                correctMatchesMemes={matchedMemes.filter(meme => meme.score > 0)}
            />


            {/*------Error saving match from server-------
            This is an error that does not prevent the user 
            from continuing to play, so we warn the user with a popup*/}
            <ToastContainer position="top-end">
            <Toast onClose={() => setShowErrorSavingPopup(false)} show={showErrorSavingPopup}  style={{color: "red"}} delay={4000} autohide >
                <Toast.Header>
                <strong className="me-auto">We apologize</strong>
                </Toast.Header>
                <Toast.Body>Error while saving the match, we apologize.</Toast.Body>
            </Toast>
            </ToastContainer>
        </>
    );
};

export default GameManager;
