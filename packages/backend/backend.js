import dotenv from 'dotenv';
dotenv.config();
import express, { json } from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 8000;
const SECRET_KEY = process.env.STEAM_WEB_API_SECRET_KEY;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("steamNgin");
});

app.get("/app", (req, res) => {
    res.send("steamNgin");
});

app.get("/app", (req, res) => {
	res.send("steamNgin");
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });


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

getPlayerCount()