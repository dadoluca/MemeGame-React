import Meme from '../models/MemeModel.mjs';

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
/*
const getRandomMeme = async () => {
  const response = await fetch(`${SERVER_URL}/api/memes/random`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}, 
    credentials: 'include'
  });
  if (response.ok) {
    const meme = await response.json();
    return new Meme(meme.id, SERVER_URL + meme.imageUrl, meme.suitableCaptions, meme.unsuitableCaptions);
  } else {
    throw new Error('Internal server error');
  }
};*/


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
      return { isSuitable: result.isSuitable, suitableCaptions: result.suitableCaptions };
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
      const result = await response.json();
      return result;
  } else {
      throw new Error('Internal server error');
  }
};

const API = {logIn, logOut, getUserInfo, getRandomMemes, verifyCaptionCorrectness, saveGame};
export default API;