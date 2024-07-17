import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";
import fs from 'fs';
import pLimit from 'p-limit';

const PLAYER_COUNT_PATH = './packages/backend/player_count.json'
const APP_LIST_PATH = './packages/backend/app_list.json'
const BATCH_SIZE = 1000; 
const CONCURRENCY_LIMIT = 5; 
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
                app.player_count = playerCount;
            }
            else {
                app.player_count = 0;
            }
            return app; // Return the app if successful
        } catch (error) {
            console.warn(`Attempt ${attempt + 1} failed for App ID:${app.appid}: ${error.message}`);
            if (attempt < RETRY_LIMIT - 1) {
                await delay(1000); // Wait 1 second before retrying
            }
        }
    }
    app.player_count = 0; // Set player count to 0 after all retries fail
    console.error(`Could not retrieve App ID:${app.appid}'s player count after ${RETRY_LIMIT} attempts`);
    return app;
}

export async function getPlayerCount() {
    const data = fs.readFileSync(APP_LIST_PATH, 'utf8');
    const jsonObject = JSON.parse(data);
    const copiedObject = JSON.parse(JSON.stringify(jsonObject));

    const apps = copiedObject.response.apps;
    const results = [];

    console.time('Total Fetch Time'); // Start timing

    for (let i = 0; i < apps.length; i += BATCH_SIZE) {
        const batchStartIndex = i;
        const batchEndIndex = Math.min(i + BATCH_SIZE, apps.length) - 1;

        console.time(`Batch ${i / BATCH_SIZE + 1} Time`); // Start timing the batch
        const batch = apps.slice(i, i + BATCH_SIZE);

        try {
            const batchResults = await Promise.all(
                batch.map(app => limit(() => fetchPlayerCount(app)))
            );
            results.push(...batchResults);
            console.log(`Fetched player counts for ${i + BATCH_SIZE} apps.\n999th appid: ${batchResults[499].appid}`);
        } catch (error) {
            console.error(`Batch ending at index ${batchEndIndex} encountered an error: ${error}`);
        }
        console.timeEnd(`Batch ${i / BATCH_SIZE + 1} Time`); // End timing the batch
        console.log(`Fetched player counts for batch ending at index ${batchEndIndex}`);
    }

    copiedObject.response.apps.sort((a,b) => b.player_count - a.player_count);
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(copiedObject, null, 2));
    console.timeEnd('Total Fetch Time'); // End timing
    console.log('Fetched all player counts');
}

export async function refreshTopGames(numberOfTopGames) {
    const data = fs.readFileSync(PLAYER_COUNT_PATH, 'utf8');
    const jsonObject = JSON.parse(data);
    jsonObject.response.apps.sort((a,b) => b.player_count - a.player_count);
    const apps = jsonObject.response.apps;
    const results = [];

    console.time('Total Fetch Time'); // Start timing

    const batch = apps.slice(0, numberOfTopGames);

    try {
        const batchResults = await Promise.all(
            batch.map(app => limit(() => fetchPlayerCount(app)))
        );
        results.push(...batchResults);
        console.log(`Fetched player counts for ${numberOfTopGames} apps.`);
    } catch (error) {
        console.error(`Batch encountered an error: ${error}`);
    }

    // Sort the data again
    jsonObject.response.apps.sort((a, b) => b.player_count - a.player_count);

    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(jsonObject, null, 2));
    console.timeEnd('Total Fetch Time'); // End timing
    console.log(`Refreshed the player count of the top ${numberOfTopGames} games.`);
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

// getPlayerCount();