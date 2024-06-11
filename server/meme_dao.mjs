/* Data Access Object (DAO) module for accessing Memes */

import { Meme } from './models/Meme.mjs';
import { db } from './db.mjs';

function getRandomMeme() {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1', (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(new Meme(row.id, row.image_path));
            }
        });
    });
}

export {getRandomMeme}