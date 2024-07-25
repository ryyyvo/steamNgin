import dotenv from 'dotenv';
import mongoose from 'mongoose';
import pLimit from 'p-limit';
import PlayerCount from './models/PlayerCount.js';

dotenv.config({path: '../.env'});

const MONGO_URI = process.env.MONGO_URI;
const CONCURRENCY_LIMIT = 25; 
const RETRY_LIMIT = 3; // Number of retries
const TIMEOUT_MS = 10000; // Timeout for fetch requests in milliseconds
const limit = pLimit(CONCURRENCY_LIMIT);

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPlayerCount(app) {
    for (let attempt = 0; attempt < RETRY_LIMIT; attempt++) {
        try {
            const body = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`, 
                { signal: AbortSignal.timeout(TIMEOUT_MS) });
            const data = await body.json();
            const playerCount = data.response.player_count;
            if (playerCount !== undefined) {
                const now = new Date();
                return {
                    appid: app.appid,
                    playerCount,
                    peak24hr: {
                        value: Math.max(playerCount, app.peak24hr?.value || 0),
                        timestamp: playerCount > (app.peak24hr?.value || 0) ? now : app.peak24hr?.timestamp
                    },
                    peakAllTime: {
                        value: Math.max(playerCount, app.peakAllTime?.value || 0),
                        timestamp: playerCount > (app.peakAllTime?.value || 0) ? now : app.peakAllTime?.timestamp
                    }
                };
            }
            return null;
        } catch (error) {
            console.warn(`Attempt ${attempt + 1} failed for App ID:${app.appid}: ${error.message}`);
            if (attempt < RETRY_LIMIT - 1) {
                await delay(Math.pow(2, attempt) * 1000); // Exponential backoff
            }
        }
    }
    console.error(`Could not retrieve App ID:${app.appid}'s player count after ${RETRY_LIMIT} attempts`);
    return null;
}

export async function populatePlayerCount(numberOfTopGames = null) {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    console.time('Total Fetch Time');

    let query = PlayerCount.find({}, 'appid peak24hr peakAllTime -_id').lean();
    if (numberOfTopGames !== null) {
        query = query.sort({ playerCount: -1 }).limit(numberOfTopGames);
    }
   
    const apps = await query;
    const bulkOps = [];

    for (let i = 0; i < apps.length; i += CONCURRENCY_LIMIT) {
        const batch = apps.slice(i, i + CONCURRENCY_LIMIT);
        try {
            const results = await Promise.all(batch.map(app => limit(() => fetchPlayerCount(app))));
            results.forEach(result => {
                if (result) {
                    bulkOps.push({
                        updateOne: {
                            filter: { appid: result.appid },
                            update: {
                                $set: {
                                    playerCount: result.playerCount,
                                    peak24hr: result.peak24hr,
                                    peakAllTime: result.peakAllTime
                                }
                            }
                        }
                    });
                }
            });
        } catch (error) {
            console.error(`Batch starting at index ${i} encountered an error: ${error}`);
        }
    }

    if (bulkOps.length > 0) {
        await PlayerCount.bulkWrite(bulkOps);
    }

    console.timeEnd('Total Fetch Time');

    if (numberOfTopGames !== null) {
        console.log(`Fetched the top ${numberOfTopGames} games' player count`);
    } else {
        console.log('Fetched all player counts');
    }

    mongoose.disconnect();
    console.log('MongoDB disconnected');
}