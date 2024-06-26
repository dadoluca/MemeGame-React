/* Data Access Object (DAO) module for accessing Memes */

import { Meme } from './models/MemeModel.mjs';
import { Caption } from './models/CaptionModel.mjs';
import { Game, Round } from './models/GameModel.mjs';

import { db } from './db.mjs';

// To retrieve the ID and URL of a meme image (or more than one)
export const getRandomMemes = (count) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, image_path FROM memes ORDER BY RANDOM() LIMIT ?', [count], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const memes = rows.map(row => new Meme(row.id, row.image_path));
                resolve(memes);
            }
        });
    });
}

// To retrieve the suitable captions of a meme given the ID
export const getMemeSuitableCaptions = (memeId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM meme_captions, captions WHERE meme_captions.caption_id = captions.id AND meme_id = ? AND is_suitable = 1 ORDER BY RANDOM() LIMIT 2', [memeId], (err, rows) => {
            if (err) {
                reject(err);
            }
            if(!rows || rows.length <2) {
                reject({error:'Not enough suitable captions found'});
            } else {
                const suitableCaptions = rows.map(row => new Caption(row.id, row.caption, row.translation_italian));
                resolve(suitableCaptions);
            }
        });
    });
}

// To retrieve the unsuitable captions of a meme given the ID
export const getMemeUnsuitableCaptions = (memeId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM meme_captions, captions WHERE meme_captions.caption_id = captions.id AND meme_id = ? AND is_suitable = 0 ORDER BY RANDOM() LIMIT 5', [memeId], (err, rows) => {
            if (err) {
                reject(err);
            }
            if(!rows || rows.length <5) {
                reject({error:'Not enough unsuitable captions found'});
            }else {
                const unsuitableCaptions = rows.map(row => new Caption(row.id, row.caption, row.translation_italian));
                resolve(unsuitableCaptions);
            }
        });
    });
}

// To check if a given caption is suitable for a given meme
export const isCaptionSuitableForMeme = (memeId, captionId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT is_suitable FROM meme_captions WHERE meme_id = ? AND caption_id = ?', [memeId, captionId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.is_suitable === 1);
            } else {
                resolve(false); // No match found
            }
        });
    });
}

// To retrieve all suitable captions for a given meme
export const getSuitableCaptionsForMeme = (memeId, allCaptionIds) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT caption_id FROM meme_captions WHERE meme_id = ? AND is_suitable = 1 AND caption_id IN (' + allCaptionIds.map(() => '?').join(',') + ')', [memeId, ...allCaptionIds], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const suitableCaptions = rows.map(row => row.caption_id);
                resolve(suitableCaptions);
            }
        });
    });
}


// To shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// To retrieve complete memes with mixed captions
export const getCompleteMemes = async (count) => {
    const memes = await getRandomMemes(count);
    //Promise all to retrieve all captions for each meme IN PARALLEL
    const completeMemes = await Promise.all(memes.map(async (meme) => {
        const suitableCaptions = await getMemeSuitableCaptions(meme.id);
        const unsuitableCaptions = await getMemeUnsuitableCaptions(meme.id);
        const allCaptions = shuffleArray([...suitableCaptions, ...unsuitableCaptions]);
        return {
            id: meme.id,
            imageUrl: meme.imagePath,
            captions: allCaptions
        };
    }));
    return completeMemes;
}

// To save the game
export const saveGame = (userId, totalScore, rounds) => {
    let totalChanges = 0; // Variable to keep track of total changes
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO games (user_id, total_score) VALUES (?, ?)',
        [userId, totalScore], function (err) {
            if (err) {
                reject(err);
            } else {
                const gameId = this.lastID; //last inserted id from games table
                totalChanges += this.changes; 
                Promise.all(rounds.map(round => insertRound(gameId,round)))
                .then((changes) =>{
                    totalChanges += changes.reduce((a, b) => a + b, 0);//sum each round changes
                    resolve(totalChanges)
                })
                .catch(err => reject(err));
            }
        });
    });
}

// To save a game round
const insertRound = (gameId,round) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO game_rounds (game_id, round, meme_id, score) VALUES (?, ?, ?, ?)', [gameId, round.roundNumber, round.memeId, round.score], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
};


// To get the match history of a certain user
export const getUserGameHistory = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT g.id as gameId, g.created_at as date, g.total_score as totalScore,
                   gr.round as roundNumber, gr.score as roundScore, m.image_path as imagePath
            FROM games g
            JOIN game_rounds gr ON g.id = gr.game_id
            JOIN memes m ON gr.meme_id = m.id
            WHERE g.user_id = ?
            ORDER BY g.created_at DESC, gr.round ASC
        `;
        
        db.all(query, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const gamesMap = new Map();
                
                rows.forEach(row => {
                    // Create a new game only for the first game round
                    if (!gamesMap.has(row.gameId)) {
                        gamesMap.set(row.gameId, new Game(row.date, row.totalScore, []));
                    }
                    // Add round to the game
                    const game = gamesMap.get(row.gameId);
                    game.rounds.push(new Round(row.roundNumber, row.roundScore, row.imagePath));
                });

                const games = Array.from(gamesMap.values());
                resolve(games);
            }
        });
    });
}
