/*
create a function to compare the current player count, 24 hr peak player count,
and all time peak player count for a SINGLE app. 
this will be run in the player_count.js file 
*/

import fs from 'fs';

const PEAK_PATH = './packages/backend/peak_player_count.json'