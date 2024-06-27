import React, { Suspense } from 'react';
import { defer, Await, useLoaderData } from 'react-router-dom';
import API from '../../services/API.mjs';
import GameManager from '../../components/game/GameManager';
import styles from './GamePage.module.css';

function GamePage() {
    const { memes } = useLoaderData();

    return (
        <div className={styles.gamePage}>
            <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
                <Await resolve={memes}>
                    {(loadedMemes) =>  {
                        if (loadedMemes.error) {
                            return <p style={{ textAlign: 'center', color: 'red' }}>{loadedMemes.message}</p>;
                        } else {
                            return <GameManager memes={loadedMemes} />
                        }
                    }}
                </Await>
            </Suspense>
        </div>
    );
};

export default GamePage;


const loadMemes = async () => {
    try {
        const memes = await API.getRandomMemes();
        return memes;
    } catch (error) {
        return { error: true, message: 'Could not fetch memes.. try again later' };
    }
};

export function loader() {
    return defer({
      memes: loadMemes(),
    });
}
