import dotenv from 'dotenv';
import fetch from "node-fetch";
import connectDB from './db/db.js';
import PlayerCount from './models/PlayerCount.js';

dotenv.config();

const SECRET_KEY = process.env.STEAM_WEB_API_SECRET_KEY;
const URL = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${SECRET_KEY}&include_games=true&include_dlc=false&include_software=true&include_videos=false&include_hardware=false&max_results=50000`

connectDB();

export async function getAppList() {
    try {
        const response = await fetch(URL); 
    
        if (!response.ok) 
            {
                throw new Error('Could not retrieve app list: ' + response.statusText);
            }
    
        const data = await response.json();
        await saveDataToMongo(data.response.apps);
    
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
            const nextUrl = `${URL}&last_appid=${currentLastAppId}`;
            const response = await fetch(nextUrl);
            const data = await response.json();

            await saveDataToMongo(data.response.apps);

            hasMore = data.response.have_more_results;
            currentLastAppId = data.response.last_appid;
        } catch (error) {
            console.error('Error getting remaining app list:', error);
            break;
        }
    }
}

async function saveDataToMongo(apps) {
    try {
        for (const app of apps) {
            const { appid, name } = app;
            const existingApp = await PlayerCount.findOne({ appid });

            if (existingApp) {
                existingApp.name = name;
                await existingApp.save();
            } else {
                const newApp = new PlayerCount({
                    appid,
                    name
                });
                await newApp.save();
            }
        }

        console.log('Data saved to MongoDB');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
    }
}