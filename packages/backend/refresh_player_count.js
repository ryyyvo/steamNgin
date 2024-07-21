import { populatePlayerCount } from "./player_count.js";
import { getAppList } from "./app_list.js";
import schedule from "node-schedule";

async function runTasks() {
	let populatePlayerCountRunning = false;
	let refreshTopGamesRunning = false;

	async function runGetPlayerCount() {
		populatePlayerCountRunning = true;
		try {
			console.log('Running populatePlayerCount at 12 AM PST');
			await getAppList();
			await populatePlayerCount(); // You can adjust the numberOfTopGames parameter here if needed
		} catch (err) {
			console.error(err);
		} finally {
			populatePlayerCountRunning = false;
			console.log('populatePlayerCount has finished');
			scheduleRefreshTopGames(); // Schedule the next run of refreshTopGames
		}
	}

	// Function to run refreshTopGames every 10 minutes using recursive setTimeout
	async function scheduleRefreshTopGames() {
		if (!populatePlayerCountRunning && !refreshTopGamesRunning) {
			refreshTopGamesRunning = true;
			try {
				console.log('Refreshing the top 5000 games');
				await populatePlayerCount(100); // Assuming 5000 is the number of top games
			} catch (err) {
				console.error(err);
			} finally {
				refreshTopGamesRunning = false;
				console.log('refreshTopGames has finished');
				setTimeout(scheduleRefreshTopGames, 10 * 60 * 1000); // Schedule next run in 10 minutes
			}
		}
	}
	// Start running refreshTopGames immediately and every 10 minutes

	// Schedule populatePlayerCount to run at 12 AM PST every day
	schedule.scheduleJob('0 0 * * *', async () => {
		if (refreshTopGamesRunning) {
		console.log('Waiting for populatePlayerCount to complete before running the next task');
		// Wait for populatePlayerCount to complete before starting the next task
		const checkInterval = setInterval(() => {
			console.log(`Checking if refreshTopGamesRunning`);
			if (!refreshTopGamesRunning) {
			clearInterval(checkInterval);
			runGetPlayerCount();
			}
		}, 10000); // Check every 10 seconds
		} else {
			runGetPlayerCount();
		}
	});

	scheduleRefreshTopGames();
}

// Start the tasks
runTasks();