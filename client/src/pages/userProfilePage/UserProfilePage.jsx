import React, { Suspense } from 'react';
import { defer, Await, useLoaderData } from 'react-router-dom';
import API from '../../services/API.mjs';
import PastGameCard from '../../components/game/PastGameCard';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
function UserProfilePage() {
  const { gameHistory } = useLoaderData();
  const { user } = useContext(AuthContext);
  return (
    <div className='container mt-4'>
      <h2 style={{ marginBottom: '40px' }}>{user.name}'s Profile</h2>
      <h4>Game History</h4>
      <Suspense fallback={<p>Loading game history...</p>}>
      <Await resolve={gameHistory}>
          {(loadedGameHistory) => {
            if (loadedGameHistory.error) {
              return <p style={{ color: 'red' }}> {loadedGameHistory.message}</p>;
            } else if (loadedGameHistory.length === 0) {
              return <p>No games played yet.</p>;
            } else {
              return loadedGameHistory.map(game => <PastGameCard key={game.date} game={game} />);
            }
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export default UserProfilePage;

const loadUserGameHistory = async () => {
  try {
    const games = await API.getUserGameHistory();
    return games;
  } catch (error) {
    return { error: true, message: 'Could not fetch game history.. try again later' };
  }
};

export function loader() {
  return defer({
    gameHistory: loadUserGameHistory(),
  });
}
