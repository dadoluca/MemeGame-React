/* Data Access Object (DAO) module for accessing Memes */

import { Meme } from './models/MemeModel.mjs';
import { Caption } from './models/CaptionModel.mjs';

import { db } from './db.mjs';

// Function that retrieves the ID and URL of a meme image
export const getRandomMeme = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, image_path FROM memes ORDER BY RANDOM() LIMIT 1', (err, row) => {
            if (err) {
                reject(err);
            } else {
                const id = row.id;
                const imagePath = row.image_path;
                resolve(new Meme(id, imagePath));
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

