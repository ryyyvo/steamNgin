import dotenv from 'dotenv';
import mongoose from 'mongoose';
import PlayerCount from './models/PlayerCount.js';

dotenv.config({path: '../.env'});

const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.STEAM_WEB_API_SECRET_KEY;
const URL = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${SECRET_KEY}&include_games=true&include_dlc=false&include_software=true&include_videos=false&include_hardware=false&max_results=50000`

export async function getAppList() {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    try {
        const response = await fetch(URL); 
    
        if (!response.ok) 
            {
                throw new Error('Could not retrieve app list: ' + response.statusText);
            }
    
        const data = await response.json();
        console.time('Total Fetch Time'); // Start timing
        await saveDataToMongo(data.response.apps);
    
        console.log('Initial data saved.');
    
        if (data.response.have_more_results) {
            await getRemainingApps(data.response.last_appid);
        }
    }
    catch (error) {
        console.error('Error getting app list:', error);
    }
    console.timeEnd('Total Fetch Time'); // End timing
    mongoose.disconnect();
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
            console.log('The next 50k apps have been retrieved.');

            hasMore = data.response.have_more_results;
            currentLastAppId = data.response.last_appid;
        } catch (error) {
            console.error('Error getting remaining app list:', error);
            break;
        }
    }
    console.log('All apps retrieved.');
}

async function saveDataToMongo(apps) {
    try {
        for (let i = apps.length - 1; i >= 0; i--) {
            const app = apps[i];
            const { appid, name } = app;

            if (!name) {
                console.warn(`Missing name for app: ${JSON.stringify(app)}`);
                continue;
            }

            const existingApp = await PlayerCount.findOne({ appid });

            if (existingApp) {
                console.log(`Appid:${appid} is already in the collection`);
                return;
            }

            const newApp = new PlayerCount({
                appid,
                name
            });
            await newApp.save();
            console.log(`Appid:${appid} has been added to the collection`);
        }
        console.log('Data saved to MongoDB');
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
    }
}