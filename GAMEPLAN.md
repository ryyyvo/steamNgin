# 1
Get entire app list and store the json on the backend using 
    GET https://api.steampowered.com/ISteamApps/GetAppList/v2/ # takes too long to parse through, gets demos and delisted games too 

# 1.1 


# 2 
Loop through each element of the json, look up the appid and get its player 
    count, and then add a new property to the array called playercount.

# 3 
Sort the json by playercount number 


// make games that have more players, fetch their playercount more often
// have certain ranges and threshholds for the frequencies of updates