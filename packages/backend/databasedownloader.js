import SteamUser from 'steam-user';
import fs from "fs";


let client = new SteamUser();

// async function main() {
//     // Log in to Steam (use appropriate login details or methods)
//     client.logOn();

//     client.on('loggedOn', async () => {
//         console.log('Logged into Steam');

//         try {
//             const appid = 440; // Replace with your desired AppID
//             const result = client.getPlayerCount(appid);
//             console.log(`Player count for appid ${appid}: ${result.playerCount}`);
//         } catch (err) {
//             console.error('Error getting player count:', err);
//         } finally {
//             client.logOff();
//         }
//     });
// }

// main().catch(console.error);

client.logOn();

client.on('loggedOn', async (details) => {
	console.log('Logged onto Steam as ' + client.steamID.steam3());

    let playerCount = client.getPlayerCount(440);
    console.log("The player count is: " + playerCount);

	console.log('Requesting appinfo for TF2 and CS:GO...');
	let result = await client.getProductInfo([440, 730], [], true); // Passing true as the third argument automatically requests access tokens, which are required for some apps

	console.log('Got app info, writing to files');
	console.log(result);

	for (let appid in result.apps) {
		fs.writeFileSync(appid + '.json', JSON.stringify(result.apps[appid].appinfo, null, '\t'));
	}

	console.log('Logging off of Steam');
	client.logOff();
});