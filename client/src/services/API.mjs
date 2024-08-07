import Meme from '../models/MemeModel.mjs';
import { Game } from '../models/PastGameModel.mjs';

const SERVER_URL = 'http://localhost:3001';

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const getRandomMemes = async () => {
  const response = await fetch(`${SERVER_URL}/api/memes/random`,{
    credentials: 'include'
  });
  if(response.ok) {
    const memes = await response.json();
    return memes.map(meme => new Meme(meme.id, SERVER_URL + meme.imageUrl, meme.captions));
  }
  else
  throw new Error('Internal server error');
}


const verifyCaptionCorrectness = async (memeId, captionId, allCaptionIds) => {
  const response = await fetch(`${SERVER_URL}/api/memes/is-correct`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      
      body: JSON.stringify({ memeId, captionId, allCaptionIds })
  });
  if (response.ok) {
      const result = await response.json();
      return { ok:true,isSuitable: result.isSuitable, suitableCaptions: result.suitableCaptions };
  } else {
      throw new Error('Internal server error');
  }
};

const saveGame = async (totalScore, rounds) => {
  const response = await fetch(`${SERVER_URL}/api/games`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ totalScore, rounds })
  });
  if (response.ok) {
      return null;
  } else {
      throw new Error('Internal server error');
  }
};

const getUserGameHistory = async () => {
  const response = await fetch(`${SERVER_URL}/api/user/games-history`, {
    credentials: 'include',
  });
  if (response.ok) {
    const games = await response.json();
    return games.map(game => new Game(game.date, game.totalScore, game.rounds, SERVER_URL));
  } else {
    throw new Error('Internal server error');
  }
};

const API = {logIn, logOut, getUserInfo, getRandomMemes, verifyCaptionCorrectness, saveGame, getUserGameHistory};
export default API;