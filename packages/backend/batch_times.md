# 0 
appid:6420 in 30 seconds for player_count.js

No Batch Time: 329326.4631347656 ms
No Batch Time: 5:29.327 (m:ss.mmm)

# 1
appid:46000 in 30 seconds for batch_player_count.js

const BATCH_SIZE = 1000;
const CONCURRENCY_LIMIT = 10; 

Batch 1 Time: 37550.121826171875 ms
Batch 1 Time: 37.550s
Fetched player counts for 1000 apps.
999th appid: 55150

Batch 2 Time: 46721.762939453125 ms
Batch 2 Time: 46.722s
Fetched player counts for 2000 apps.
999th appid: 244910

Batch 3 Time: 46539.348876953125 ms
Batch 3 Time: 46.539s
Fetched player counts for 3000 apps.
999th appid: 287310

avg: 43.60s 

7.5x improvement over # 0 

# 2 
const BATCH_SIZE = 1000; 
const CONCURRENCY_LIMIT = 15;

Batch 1 Time: 55580.908935546875 ms
Batch 1 Time: 55.581s
Fetched player counts for 1000 apps.
999th appid: 55150

Batch 2 Time: 58844.83203125 ms
Batch 2 Time: 58.845s
Fetched player counts for 2000 apps.
999th appid: 244910

Batch 3 Time: 44356.54296875 ms
Batch 3 Time: 44.357s
Fetched player counts for 3000 apps.
999th appid: 287310

avg: 52.928s

# 3
const BATCH_SIZE = 1000;
const CONCURRENCY_LIMIT = 5;

Batch 1 Time: 48981.4189453125 ms
Batch 1 Time: 48.982s
Fetched player counts for 1000 apps.
999th appid: 55150

Batch 2 Time: 49985.51806640625 ms
Batch 2 Time: 49.986s
Fetched player counts for 2000 apps.
999th appid: 244910

Batch 3 Time: 49059.89990234375 ms
Batch 3 Time: 49.060s
Fetched player counts for 3000 apps.
999th appid: 287310

avg: 49.343s