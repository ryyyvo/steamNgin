import express, { json } from "express";
import dotenv from 'dotenv';
import fetch from "node-fetch";
const app = express();
const port = 8000;
dotenv.config()


const secretKey = process.env.SECRET_KEY;


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
		// const response = await fetch(`https://api.steamapis.com/market/apps?api_key=${secretKey}`);
        const response = await fetch(`https://api.steamapis.com/market/apps?api_key=yvR_qsB4Y091a8rKda1liGukX94`);

		if (!response.ok) 
			{
				throw new Error('Could not retrieve applist ' + response.statusText);
			}
		const apps = await response.json();
        // apps.forEach(app => {
        //     playerCount = await fetch('https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/')
        //     console.log(`App ID: ${app.appid}, App Name: ${app.name}`);
        // });

        for (const app of apps) 
            {
                console.log(`App ID: ${app.appid}, App Name: ${app.name}`);
                try {
                    const playerCount = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${app.appid}`);
                    if (!isNaN(playerCount.player_count))
                        {
                            console.log(`App ID:${app.appid}'s player count is undefined`);
                        }
                    else 
                    {
                        console.log(`${app.name}'s player count: ${playerCount.player_count}`);
                    }
                    
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

getPlayerCount()