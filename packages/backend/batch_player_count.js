import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";
import fs from 'fs';
import pLimit from 'p-limit';

const PLAYER_COUNT_PATH = './packages/backend/batch_player_count.json'
const APP_LIST_PATH = './packages/backend/app_list.json'

const BATCH_SIZE = 1000; // Adjust based on API rate limits and system capability
const CONCURRENCY_LIMIT = 10; // Adjust based on API rate limits and system capability

const limit = pLimit(CONCURRENCY_LIMIT);

async function fetchPlayerCount(app) {
    try {
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`);
        const data = await response.json();
        const playerCount = data.response.player_count;
        if (playerCount !== undefined) {
            app.player_count = playerCount;
        }
        else {
            app.player_count = 0;
        }
        // console.log(`App ID: ${app.appid}, App Name: ${app.name}`);
        // console.log(`Player count: ${app.player_count}`);
    } catch (error) {
        app.player_count = 0;
        console.error(`Could not retrieve App ID:${app.appid}'s player count`);
    }
    return app;
}

async function getPlayerCount() {
    const data = fs.readFileSync(APP_LIST_PATH, 'utf8');
    const jsonObject = JSON.parse(data);
    const copiedObject = JSON.parse(JSON.stringify(jsonObject));

    const apps = copiedObject.response.apps;
    const results = [];

    console.time('Total Fetch Time'); // Start timing

    for (let i = 0; i < apps.length; i += BATCH_SIZE) {
        console.time(`Batch ${i/BATCH_SIZE + 1} Time`);
        const batch = apps.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
            batch.map(app => limit(() => fetchPlayerCount(app)))
        );
        results.push(...batchResults);
        console.timeEnd(`Batch ${i/BATCH_SIZE + 1} Time`); // End timing the batch
        console.log(`Fetched player counts for ${i + BATCH_SIZE} apps.\n999th appid: ${batchResults[999].appid}`);
    }

    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(copiedObject, null, 2));
    console.timeEnd('Total Fetch Time'); // End timing
    console.log('Fetched all player counts');
}

getPlayerCount().catch(error => {
    console.error('Error fetching player counts:', error);
});