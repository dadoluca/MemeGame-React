import React from 'react';
import GameComponent from '../components/GameComponent'; // Supponiamo che questo sia il componente per il round di gioco
import { useContext } from 'react';
import { AuthContext } from '../state/AuthContext';
function FullGamePage() {
const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Three Rounds Game</h1>
      <p>Benvenuto {user.name}</p>
      <GameComponent /> 
    </div>
  );
}

export default FullGamePage;