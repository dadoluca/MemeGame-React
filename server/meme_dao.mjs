/* Data Access Object (DAO) module for accessing Memes */

import { Meme } from './models/MemeModel.mjs';
import { Caption } from './models/CaptionModel.mjs';

import { db } from './db.mjs';

// Function that retrieves the ID and URL of a meme image (or more than one)
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

// Function that retrieves the suitable captions of a meme given the ID
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

// Function that retrieves the unsuitable captions of a meme given the ID
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

// Function that checks if a given caption is suitable for a given meme
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


// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function that retrieves complete memes with mixed captions
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

