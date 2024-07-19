import mongoose from "mongoose";

const Schema = mongoose.Schema;

const playerCountHistorySchema = new Schema(
    {
        playerId: {
            type: Schema.Types.ObjectId,
            ref: 'PlayerCount',
            required: true
        },
        playerCounts: [
            {
                type: Number,
                required: true
            }
        ],
        timestamps: [ 
            {
                type: Date,
                required: true
            }
        ]
    }
);

const PlayerCountHistory = mongoose.model("PlayerCountHistory", playerCountHistorySchema);

export default PlayerCountHistory;
