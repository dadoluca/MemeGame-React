import React from 'react';
import GameComponent from '../components/GameComponent'; 
import { useContext, useState } from 'react';
import { AuthContext } from '../state/AuthContext';
function GamePage() {
    const { loggedIn, user } = useContext(AuthContext);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    return (
        <div>
            <h1>{loggedIn ? "Three Rounds Game" : "Single Round Game" }</h1>
            <p>{loggedIn ? "Player "+user.name : "Loggati per giocare più round!"}</p>
            <p>Round: {round}</p>
            <p>Score: {score}</p>
            <GameComponent score={score} setScore={setScore} round={round} setRound={setRound} /> 
        </div>
    );
}
export default GamePage;
