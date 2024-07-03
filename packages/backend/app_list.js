import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";
import fs, { existsSync } from 'fs';

const SECRET_KEY = process.env.STEAM_WEB_API_SECRET_KEY;

const URL = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${SECRET_KEY}&include_games=true&include_dlc=false&include_software=true&include_videos=false&include_hardware=false&max_results=50000`

async function getAppList() {
    try {
        const response = await fetch(URL); 
        // IStoreService
    
        if (!response.ok) 
            {
                throw new Error('Could not retrieve app list: ' + response.statusText);
            }
    
        const data = await response.json();
    
        fs.writeFileSync('./packages/backend/app_list.json', JSON.stringify(data, null, 2));
        console.log('Initial data saved.');
    
        if (data.response.have_more_results) {
            await getRemainingApps(data.response.last_appid);
        }
    }
    catch (error) {
        console.error('Error getting app list:', error);
    }

}

async function getRemainingApps(lastAppId) {
    let hasMore = true;
    let currentLastAppId = lastAppId;

    while (hasMore) {
        try {
            // Modify URL to include lastAppId to get the next fetch call
            const nextUrl = `${URL}&last_appid=${currentLastAppId}`;
            const response = await fetch(nextUrl);
            const data = await response.json();

            // Append new apps to the existing JSON file 
            const existingData = JSON.parse(fs.readFileSync('./packages/backend/app_list.json'));
            existingData.response.apps.push(...data.response.apps);
            fs.writeFileSync('./packages/backend/app_list.json', JSON.stringify(existingData, null, 2));
            console.log('Appended new data');

            // Update the lastAppId and hasMore variables
            hasMore = data.response.have_more_results;
            currentLastAppId = data.response.last_appid;
        }
        
        catch (error) {
            console.error('Error getting remaining app list:', error);
            break;
        }
    }
    
    // Remove the have_more_results and last_appid JSON element from app_list 
    const existingData = JSON.parse(fs.readFileSync('./packages/backend/app_list.json'));
    delete existingData.response.have_more_results;
    delete existingData.response.last_appid;
    fs.writeFileSync('./packages/backend/app_list.json', JSON.stringify(existingData, null, 2));
}

async function getPlayerCount() {
	try {
        const response = await fetch(`https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${SECRET_KEY}&
            include_games=true&
            include_dlc=false&
            include_software=true&
            include_videos=false&
            include_hardware=false&
            max_results=50000`); 
        // IStoreService

		if (!response.ok) 
			{
				throw new Error('Could not retrieve applist ' + response.statusText);
			}

		const data = await response.json();
        if (data.response.have_more_results === true) 
        {

        }
		const apps = data.response.apps;
        let count = 0;

        for (const app of apps) 
            {
                console.log(`App ID: ${app.appid}, App Name: ${app.name}`);
                try {
                    const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`);
                    const data = await response.json()
                    const playerCount = data.response.player_count
                    count++;
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

getAppList()