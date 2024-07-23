import dotenv from 'dotenv';
import mongoose from 'mongoose';
import PlayerCount from './models/PlayerCount.js';
import PlayerCountHistory from './models/PlayerCountHistory.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

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
    const apps = await PlayerCount.find({}, 'peak24hr name').lean();
    console.timeEnd('Total Find App Time'); // End timing

    console.time('Total History Update Time'); // Start timing
    for (const app of apps) {
        
        const historyEntry = {
            playerCount: {
                value: app.peak24hr.value,
                timestamp: app.peak24hr.timestamp
            }
        };

        // First remove old entries beyond 30 days
        await PlayerCountHistory.updateOne(
            { playerCountId: app._id },
            { $pull: { history: { 'playerCount.timestamp': { $lt: thirtyDaysAgo } } } },
            { upsert: true }
        );

                // Then add the new entry
        await PlayerCountHistory.updateOne(
            { playerCountId: app._id },
            { $push: { history: historyEntry } },
            { upsert: true }
        );
        console.log(`Recorded peak player counts for ${app.name}`);
    }
    console.timeEnd('Total History Update Time'); // End timing
    mongoose.disconnect();
    console.log('MongoDB disconnected');
} 

updatePlayerCountHistory();