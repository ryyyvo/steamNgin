// refreshPlayerCount.js
import { populatePlayerCount } from "./playerCount.js";
import { getAppList } from "./appList.js";
import schedule from "node-schedule";

export function startPlayerCountRefresh() {
    let populatePlayerCountRunning = false;
    let refreshTopGamesRunning = false;

    async function runGetPlayerCount() {
        populatePlayerCountRunning = true;
        try {
            console.log('Running populatePlayerCount at 12 AM PST');
            await getAppList();
            await populatePlayerCount(); // You can adjust the numberOfTopGames parameter here if needed
        } catch (err) {
            console.error('Error in runGetPlayerCount:', err);
        } finally {
            populatePlayerCountRunning = false;
            console.log('populatePlayerCount has finished');
            scheduleRefreshTopGames(); // Schedule the next run of refreshTopGames
        }
    }

    async function scheduleRefreshTopGames() {
        if (!populatePlayerCountRunning && !refreshTopGamesRunning) {
            refreshTopGamesRunning = true;
            try {
                console.log('Refreshing the top 1000 games');
                await populatePlayerCount(1000);
            } catch (err) {
                console.error('Error in scheduleRefreshTopGames:', err);
            } finally {
                refreshTopGamesRunning = false;
                console.log('refreshTopGames has finished');
                setTimeout(scheduleRefreshTopGames, 20 * 60 * 1000); // Schedule next run in 20 minutes
            }
        } else {
            // If either task is running, reschedule after a short delay
            setTimeout(scheduleRefreshTopGames, 60 * 1000); // Try again in 1 minute
        }
    }

    // Schedule populatePlayerCount to run at 12 AM PST every day
    schedule.scheduleJob('0 0 * * *', async () => {
        if (refreshTopGamesRunning) {
            console.log('Waiting for refreshTopGames to complete before running populatePlayerCount');
            // Wait for refreshTopGames to complete before starting populatePlayerCount
            const checkInterval = setInterval(() => {
                if (!refreshTopGamesRunning) {
                    clearInterval(checkInterval);
                    runGetPlayerCount();
                }
            }, 10000); // Check every 10 seconds
        } else {
            runGetPlayerCount();
        }
    });

    // Start running refreshTopGames immediately
    scheduleRefreshTopGames();
}