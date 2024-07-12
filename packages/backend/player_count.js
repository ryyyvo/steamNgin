import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";
import fs from 'fs';

const PLAYER_COUNT_PATH = './packages/backend/player_count.json'
const APP_LIST_PATH = './packages/backend/app_list.json'

// open the app_list.json, loop through the apps, use fetch to get the playercount based off of app.appid
// (in case of a network error in retrieving player_count.json) write a function to save progress of current json and retry the fetch again
// or, on error, set the player count to 0 
// or, on error, set player count to -1 and then loop through checking for apps who's playercount is -1, then attempt to find it again

async function getPlayerCount() {

    const data = fs.readFileSync(APP_LIST_PATH, 'utf8');

    const jsonObject = JSON.parse(data);

    const copiedObject = JSON.parse(JSON.stringify(jsonObject));

    for (const app of copiedObject.response.apps) 
        {
            console.log(`App ID: ${app.appid}, App Name: ${app.name}`);
            try {
                const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`);
                const data = await response.json()
                const playerCount = data.response.player_count
                if (!playerCount) {
                    app.player_count = 0;
                }
                else {
                    app.player_count = playerCount;
                    
                }
                console.log(`Player count: ${app.player_count}`);
            }
            catch (error) {
                app.player_count = 0
                console.error(`Could not retrieve App ID:${app.appid}'s player count`);
            }
            
        }
    
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(copiedObject, null, 2));

}

async function test_getPlayerCount()
{
    try {
        const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=440`);
        const data = await response.json()
        const playerCount = data.response.player_count
        console.log(`Team Fortress 2's player count: ${playerCount}`);
    }
    catch (error) {
		console.error('There was a problem with the fetch operation', error);
	}
}

function setPlayerCountZero() {
    const existingData = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    for (const app of existingData.response.apps)
    {
        if (app.player_count === undefined) {
            app.player_count = 0;
            console.log(`${app.player_count}`)
        }
    }
    fs.writeFileSync(PLAYER_COUNT_PATH, JSON.stringify(existingData, null, 2));
}

function sortByPlayerCount() {
    const jsonData = JSON.parse(fs.readFileSync(PLAYER_COUNT_PATH));
    jsonData.response.apps.sort((a,b) => b.player_count - a.player_count);
}

// getPlayerCount()
// setPlayerCountZero()

// export default getPlayerCount;