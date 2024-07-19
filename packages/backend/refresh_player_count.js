import { populatePlayerCount, refreshTopGames} from "./player_count.js";
import { getAppList } from "./app_list.js";
import schedule from "node-schedule";
// player_count.json already exists

async function runTasks() {
    let getPlayerCountRunning = false;
    let refreshTopGamesRunning = false;
  
    async function runGetPlayerCount() {
      getPlayerCountRunning = true;
      try {
        console.log('Running populatePlayerCount at 12 AM PST');
        await getAppList();
        await populatePlayerCount();
      } catch (err) {
        console.error(err);
      } finally {
        getPlayerCountRunning = false;
        // Schedule the next run of refreshTopGames
        scheduleRefreshTopGames();
        console.log('populatePlayerCount has finished');
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
  
    // Function to run refreshTopGames every 10 minutes using recursive setTimeout
    async function scheduleRefreshTopGames() {
      if (!getPlayerCountRunning && !refreshTopGamesRunning) {
        refreshTopGamesRunning = true;
        try {
          console.log('Running refreshTopGames');
          await refreshTopGames(5000); 
        } catch (err) {
          console.error(err);
        } finally {
          refreshTopGamesRunning = false;
          console.log('refreshTopGames has finished');
          if (!getPlayerCountRunning) {
            setTimeout(scheduleRefreshTopGames, 10 * 60 * 1000); // Schedule next run in 10 minutes
          }
        }
      }
    }
  
    // Start running refreshTopGames immediately and every 10 minutes
    scheduleRefreshTopGames();
  }
  
  // Start the tasks
  runTasks();