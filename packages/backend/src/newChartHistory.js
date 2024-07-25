import dotenv from 'dotenv';
import mongoose from 'mongoose';
import PlayerCount from './models/PlayerCount.js';
import PlayerCountHistory from './models/PlayerCountHistory.js';

dotenv.config({path: '../.env'});

const MONGO_URI = process.env.MONGO_URI;

function normalizeDate(date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
}

export async function updatePlayerCountHistory() {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    console.time('Total Find App Time'); // Start timing
    const apps = await PlayerCount.find({}, 'peak24hr name appid').lean();
    console.timeEnd('Total Find App Time'); // End timing

    console.time('Total History Update Time'); // Start timing

    const bulkInsertOps = [];

    for (const app of apps) {
        const normalizedTimestamp = normalizeDate(app.peak24hr.timestamp);
        const historyEntry = {
            playerCount: {
                value: app.peak24hr.value,
                timestamp: normalizedTimestamp
            }
        };

        // Prepare bulk operations for inserting new history entries if they don't exist
        bulkInsertOps.push({
            updateOne: {
                filter: { playerCountId: app._id },
                update: { $addToSet: { history: historyEntry } },
                upsert: true
            }
        });

        // Prepare bulk operations for removing old entries beyond 30 days
        bulkInsertOps.push({
            updateOne: {
                filter: { playerCountId: app._id },
                update: { $pull: { history: { 'playerCount.timestamp': { $lt: thirtyDaysAgo } } } }
            }
        });

        console.log(`Prepared update for appid: ${app.appid}, ${app.name}`);
    }

    // Execute bulk insert and delete operations
    if (bulkInsertOps.length > 0) {
        await PlayerCountHistory.bulkWrite(bulkInsertOps);
    }

    console.timeEnd('Total History Update Time'); // End timing
    mongoose.disconnect();
    console.log('MongoDB disconnected');
}

updatePlayerCountHistory();
