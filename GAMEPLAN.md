# 1
Get entire app list and store the json on the backend using 
    GET https://api.steampowered.com/ISteamApps/GetAppList/v2/ 
    # takes too long to parse through, gets demos and delisted games too 
    
    GET https://api.steampowered.com/IStoreService/GetAppList/v1/?key=F1BB3071CD0798D8B6F82C3E1AF6EBF3&include_games=true&include_dlc=false&include_software=true&include_videos=false&include_hardware=false&max_results=50000 
    # i believe this is the move 
    # gets games/software that actually have a public store front. dlcs, videos, and hardware are not included  

# 1.1 


# 2 
Loop through each element of the json, look up the appid and get its player 
    count, and then add a new property to the array called playercount.

# 3 
Sort the json by playercount number 


// make games that have more players, fetch their playercount more often
// have certain ranges and threshholds for the frequencies of updates