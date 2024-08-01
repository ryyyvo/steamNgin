import cron from 'node-cron';
import { promises as fs } from 'fs';
import { getAppList } from './appList.js';
import { populatePlayerCount } from './playerCount.js';

const LOCK_FILE = 'scheduler.lock';
const MAX_RETRY_TIME = 30 * 60 * 1000; // 30 minutes
const RETRY_INTERVAL = 30 * 1000; // 30 seconds

async function acquireLock() {
  try {
    await fs.writeFile(LOCK_FILE, 'locked', { flag: 'wx' });
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') {
      return false;
    }
    throw error;
  }
}

async function releaseLock() {
  try {
    await fs.unlink(LOCK_FILE);
  } catch (error) {
    console.error('Error releasing lock:', error);
  }
}

async function getAllGames() {
  console.log('Getting app list');
  await getAppList();
  console.log('Populating player counts from new app list')
  await populatePlayerCount();
}

async function getTopGames() {
  console.log('Getting the top 1000 player counts');
  await populatePlayerCount(1000);
}

async function scheduledTask(task, getAllGames = false) {
  const startTime = Date.now();
  while (true) {
    if (await acquireLock()) {
      try {
        await task();
      } finally {
        await releaseLock();
      }
      return;
    } 
    else {
      if (getAllGames) {
        console.log('getAllGames waiting for lock...');
        if (Date.now() - startTime > MAX_RETRY_TIME) {
          console.log('Failed to acquire lock for daily task after maximum retry time. Skipping this execution');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      } else {
        console.log('Frequent task found lock. Skipping this execution');
        return;
      }
    }
  }
}

export function startScheduler() {
  // Schedule daily tasks at 12 AM
  cron.schedule('47 1 * * *', () => {
    scheduledTask(getAllGames, true);
  });

  // Schedule frequent task every 20 minutes
  cron.schedule('*/20 * * * *', () => {
    scheduledTask(getTopGames);
  });

  console.log('Scheduler started');
}