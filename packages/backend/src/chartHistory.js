import dotenv from 'dotenv';
import mongoose from 'mongoose';
import PlayerCount from './models/PlayerCount.js';
import PlayerCountHistory from './models/PlayerCountHistory.js';

dotenv.config({path: '../.env'});

const MONGO_URI = process.env.MONGO_URI;

// Helper function to normalize a date to the start of the day
const normalizeDate = (date) => new Date(date.setHours(0, 0, 0, 0));

export async function updatePlayerCountHistory() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    console.time('Total Find App Time'); // Start timing
    const apps = await PlayerCount.find({}, 'peak24hr appid').lean();
    console.timeEnd('Total Find App Time'); // End timing

    console.time('Total History Update Time'); // Start timing
    for (const app of apps) {
        const historyEntry = {
            playerCount: {
                value: app.peak24hr.value,
                timestamp: normalizeDate(app.peak24hr.timestamp)
            }
        };

        // Remove old entries beyond 30 days
        await PlayerCountHistory.updateOne(
            { playerCountId: app._id },
            { $pull: { history: { 'playerCount.timestamp': { $lt: thirtyDaysAgo } } } },
            { upsert: true }
        );

        // Check if the history entry already exists for the day
        const existingHistory = await PlayerCountHistory.findOne(
            { playerCountId: app._id, 'history.playerCount.timestamp': historyEntry.playerCount.timestamp }
        ).lean();

        if (existingHistory) {
            // Update the existing entry with the higher value
            await PlayerCountHistory.updateOne(
                { playerCountId: app._id, 'history.playerCount.timestamp': historyEntry.playerCount.timestamp },
                { 
                    $set: { 
                        'history.$.playerCount.value': Math.max(
                            existingHistory.history.find(entry => 
                                new Date(entry.playerCount.timestamp).getTime() === historyEntry.playerCount.timestamp.getTime()
                            ).playerCount.value, 
                            historyEntry.playerCount.value
                        ) 
                    } 
                }
            );
        } else {
            // Add the new entry if it doesn't exist
            await PlayerCountHistory.updateOne(
                { playerCountId: app._id },
                { $push: { history: historyEntry } },
                { upsert: true }
            );
        }

        console.log(`Recorded peak player counts for ${app.appid}`);
    }
    console.timeEnd('Total History Update Time'); // End timing
    mongoose.disconnect();
    console.log('MongoDB disconnected');
}

updatePlayerCountHistory();