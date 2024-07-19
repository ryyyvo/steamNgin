import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fetch from "node-fetch";
import pLimit from 'p-limit';
import PlayerCount from './models/PlayerCount.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const CONCURRENCY_LIMIT = 10; 
const RETRY_LIMIT = 3; // Number of retries
const TIMEOUT_MS = 10000; // Timeout for fetch requests in milliseconds

export const limit = pLimit(CONCURRENCY_LIMIT);

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPlayerCount(app) {
    for (let attempt = 0; attempt < RETRY_LIMIT; attempt++) {
        try {
            const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`, 
                { signal: AbortSignal.timeout(TIMEOUT_MS) });
            const data = await response.json();
            const playerCount = data.response.player_count;
            if (playerCount !== undefined) {
                await PlayerCount.updateOne({ appid: app.appid }, { $set: {playerCount} });
                console.log(`Updated player count for App ID:${app.appid}`);
            }
            return; // Return the app if successful
        } catch (error) {
            console.warn(`Attempt ${attempt + 1} failed for App ID:${app.appid}: ${error.message}`);
            if (attempt < RETRY_LIMIT - 1) {
                await delay(1000); // Wait 1 second before retrying
            }
        }
    }
    console.error(`Could not retrieve App ID:${app.appid}'s player count after ${RETRY_LIMIT} attempts`);
}

export async function populatePlayerCount() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }

    console.time('Total Fetch Time'); // Start timing

    const apps = await PlayerCount.find({}, 'appid -_id').lean(); // Select only appid field
    
    for (let i = 0; i < apps.length; i += CONCURRENCY_LIMIT) {
        const batch = apps.slice(i, i + CONCURRENCY_LIMIT);
        try {
            await Promise.all(batch.map(app => limit(() => fetchPlayerCount(app))));
        } catch (error) {
            console.error(`Batch starting at index ${i} encountered an error: ${error}`);
        }
    }

    console.timeEnd('Total Fetch Time'); // End timing
    console.log('Fetched all player counts');
    mongoose.disconnect();
}

export async function refreshTopGames(numberOfTopGames) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }

    console.time('Total Fetch Time'); // Start timing
    const apps = await PlayerCount.find().sort({ playerCount: -1 }).limit(numberOfTopGames);

    try {
        await Promise.all(apps.map(app => limit(() => fetchPlayerCount(app))));
        console.log(`Refreshed the player count of the top ${numberOfTopGames} games.`);
    } catch (error) {
        console.error(`Batch encountered an error: ${error}`);
    }

    console.timeEnd('Total Fetch Time'); // End timing
    mongoose.disconnect();
}

function sortByPlayerCountAscending() {
    const jsonObject = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    jsonObject.response.apps.sort((a,b) => a.player_count - b.player_count);
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(jsonObject, null, 2));
    console.log(`Sorted player counts in ascending order.`);
}

function sortByPlayerCountDescending() {
    const jsonObject = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    jsonObject.response.apps.sort((a,b) => b.player_count - a.player_count);
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(jsonObject, null, 2));
    console.log(`Sorted player counts in descending order.`);
}

function sortByAppIdAscending() {
    const jsonObject = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    jsonObject.response.apps.sort((a, b) => a.app_id - b.app_id);
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(jsonObject, null, 2));
    console.log(`Sorted app id's in ascending order.`);
}

function sortByAppIdDescending() {
    const jsonObject = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    jsonObject.response.apps.sort((a, b) => b.app_id - a.app_id);
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(jsonObject, null, 2));
    console.log(`Sorted app id's in descending order.`);
}

function sortByNameAscending() {
    const jsonObject = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    jsonObject.response.apps.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(jsonObject, null, 2));
    console.log(`Sorted names in alphabetical order.`);
}

function sortByNameDescending() {
    const jsonObject = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    jsonObject.response.apps.sort((a, b) => {
        if (a.name < b.name) return 1;
        if (a.name > b.name) return -1;
        return 0;
    });
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(jsonObject, null, 2));
    console.log(`Sorted names in reverse alphabetical order.`);
}

populatePlayerCount();