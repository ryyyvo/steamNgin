import express, { json } from "express";
import fetch from "node-fetch";
const app = express();
const port = 8000;


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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });


async function getPlayerCount() {
	try {
		const response = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/'); // ISteamApps

		if (!response.ok) 
			{
				throw new Error('Could not retrieve applist ' + response.statusText);
			}
		const data = await response.json();
		const apps = data.applist.apps;

        for (const app of apps) 
            {
                console.log(`App ID: ${app.appid}, App Name: ${app.name}`);
                try {
                    const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`);
                    const data = await response.json()
                    const playerCount = data.response.player_count
                    console.log(`${app.name}'s player count: ${playerCount}`);
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