import mongoose from "mongoose";

const Schema = mongoose.Schema;

const playerCountSchema = new Schema(
    {
        appid: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        playerCount: {
            type: Number,
            default: 0
        },
        peak24hr: {
            value: {
                type: Number,
                default: 0
            },
            timestamp: {
                type: Date
            }
        },
        peakAllTime: {
            value: {
                type: Number,
                default: 0
            },
            timestamp: {
                type: Date
            }
        },
    },
    { collection: 'playercounts' }
);


playerCountSchema.index({ appid: 1 }, { unique: true }); 
playerCountSchema.index({ name: 'text' });

const PlayerCount = mongoose.model("PlayerCount", playerCountSchema);

export default PlayerCount;

/* INCLUDE:
https://store.steampowered.com/api/appdetails?appids=730
or
https://store.steampowered.com/api/appdetails?appids=730&filters=basic

https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI  : info about what the api contains

appid
name
is_free
header_image
developers (optional)
publishers
price_overview (optional. omitted if free-to-play)
packages
package_groups
platforms:
    - windows
    - mac
    - linux
categories (optional)
genres (optional)
release_date
price (hopefully. price on other keyshops)
*/