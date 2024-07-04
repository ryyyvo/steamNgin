import dotenv from 'dotenv';
dotenv.config();
import fetch from "node-fetch";
import fs from 'fs';

const SECRET_KEY = process.env.STEAM_WEB_API_SECRET_KEY;

const URL = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${SECRET_KEY}&include_games=true&include_dlc=false&include_software=true&include_videos=false&include_hardware=false&max_results=50000`
const APP_LIST_PATH = './packages/backend/app_list.json'

async function getAppList() {
    try {
        const response = await fetch(URL); 
        // IStoreService
    
        if (!response.ok) 
            {
                throw new Error('Could not retrieve app list: ' + response.statusText);
            }
    
        const data = await response.json();
    
        fs.writeFileSync(APP_LIST_PATH, JSON.stringify(data, null, 2));
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
            const existingData = JSON.parse(fs.readFileSync(APP_LIST_PATH));
            existingData.response.apps.push(...data.response.apps);
            fs.writeFileSync(APP_LIST_PATH, JSON.stringify(existingData, null, 2));
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
    const existingData = JSON.parse(fs.readFileSync(APP_LIST_PATH));
    delete existingData.response.have_more_results;
    delete existingData.response.last_appid;
    fs.writeFileSync(APP_LIST_PATH, JSON.stringify(existingData, null, 2));
    removeFieldsFromApps()
}

// Remove last_modified and price_change_number elements from json
function removeFieldsFromApps() { 
    const data = JSON.parse(fs.readFileSync(APP_LIST_PATH, 'utf8'));

    data.response.apps = data.response.apps.map(app => {
        const { last_modified, price_change_number, ...rest } = app;
        return rest;
    });

    fs.writeFileSync(APP_LIST_PATH, JSON.stringify(data, null, 2));
    console.log('Fields removed and file updated.');

}

getAppList()