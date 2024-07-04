import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";
import fs from 'fs';

const PLAYER_COUNT_PATH = './packages/backend/player_count.json'
const APP_LIST_PATH = './packages/backend/app_list.json'

// open the app_list.json, loop through the apps, use fetch to get the playercount based off of app.appid

async function getPlayerCount() {

    const data = fs.readFileSync(PLAYER_COUNT_PATH, 'utf8');

    const jsonObject = JSON.parse(data);

    const copiedObject = JSON.parse(JSON.stringify(jsonObject));

    copiedObject.

	try {
        for (const app of apps) 
            {
                console.log(`App ID: ${app.appid}, App Name: ${app.name}`);
                try {
                    const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`);
                    const data = await response.json()
                    const playerCount = data.response.player_count
                    console.log(`${app.name}'s player count: ${playerCount}`);
                    console.log(`Count: ${count}`)
                }
                catch (error) {
                    console.error(`Could not retrieve App ID:${app.appid}'s player count`);
                }
                
            }
	}
	catch (error) {
		console.error('There was a problem with the fetch operation', error);
	}
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

export default getPlayerCount;