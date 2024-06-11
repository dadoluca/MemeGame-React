import React from 'react';
import GameComponent from '../components/GameComponent'; // Supponiamo che questo sia il componente per il round di gioco

function SingleRoundGamePage() {
  return (
    <div>
      <h1>Single Round Game</h1>
      <p>Benvenuto al gioco con un solo round!</p>
      <GameComponent /> 
    </div>
  );
}

export default SingleRoundGamePage;
