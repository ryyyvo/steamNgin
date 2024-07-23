import mongoose from "mongoose";

const Schema = mongoose.Schema;

const playerCountHistorySchema = new Schema(
    {
        playerCountId: {
            type: Schema.Types.ObjectId,
            ref: 'PlayerCount',
            required: true
        },
        playerCounts: [
            {
                value: {
                    type: Number,
                    required: true
                },
                timestamp: {
                    type: Date,
                    required: true
                }
            }
        ]
    },
    { collection: 'playercounthistory' }
);

playerCountHistorySchema.index({ 'playerCounts.timestamp': 1 });

const PlayerCountHistory = mongoose.model("PlayerCountHistory", playerCountHistorySchema);

export default PlayerCountHistory;
