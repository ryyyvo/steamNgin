import cron from 'node-cron';
import { promises as fs } from 'fs';
import { getAppList } from './appList.js';
import { populatePlayerCount } from './playerCount.js';

const LOCK_FILE = 'scheduler.lock';

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

async function runDailyTasks() {
  console.log('Getting app list');
  await getAppList();
  console.log('Populating player counts from new app list')
  await populatePlayerCount();
}

async function runFrequentTask() {
  console.log('Getting the top 1000 player counts');
  await populatePlayerCount(1000);
}

async function scheduledTask(task) {
  if (await acquireLock()) {
    try {
      await task();
    } finally {
      await releaseLock();
    }
  } else {
    console.log('Another task is running. Skipping this execution');
  }
}

// Schedule daily tasks at 12 AM
cron.schedule('0 0 * * *', () => {
  scheduledTask(runDailyTasks);
});

// Schedule frequent task every 20 minutes
cron.schedule('*/15 * * * *', () => {
  scheduledTask(runFrequentTask);
});

console.log('Scheduler started');