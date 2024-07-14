
# Batch Times Performance Log

## 0 No batch or concurrency limit

- **No Batch Time for 1000 apps**: 
  - 329326.4631347656 ms
  - 5:29.327 (m:ss.mmm)

## 1 `const BATCH_SIZE = 1000; const CONCURRENCY_LIMIT = 1;`

- **Batch 1 Time**:
  - 351931.0390625 ms
  - 5:51.931 (m:ss.mmm)

- Fetched player counts for 1000 apps.
- 999th appid: undefined

## 2 `const BATCH_SIZE = 1000; const CONCURRENCY_LIMIT = 10;`

- **Batch 1 Time**:
  - 37550.121826171875 ms
  - 37.550s

- **Batch 2 Time**:
  - 46721.762939453125 ms
  - 46.722s

- **Batch 3 Time**:
  - 46539.348876953125 ms
  - 46.539s

- **Average**: 43.60s
- **Total from batch 1-3**: 130.81s
- **Improvement over # 0**: 7.5x

- Fetched player counts for:
  - 1000 apps, 999th appid: 55150
  - 2000 apps, 999th appid: 244910
  - 3000 apps, 999th appid: 287310

## 3 `const BATCH_SIZE = 1000; const CONCURRENCY_LIMIT = 15;`

- **Batch 1 Time**:
  - 55580.908935546875 ms
  - 55.581s

- **Batch 2 Time**:
  - 58844.83203125 ms
  - 58.845s

- **Batch 3 Time**:
  - 44356.54296875 ms
  - 44.357s

- **Average**: 52.928s
- **Total from batch 1-3**: 158.78s

- Fetched player counts for:
  - 1000 apps, 999th appid: 55150
  - 2000 apps, 999th appid: 244910
  - 3000 apps, 999th appid: 287310

## 4 `const BATCH_SIZE = 1000; const CONCURRENCY_LIMIT = 5;`

- **Batch 1 Time**:
  - 48981.4189453125 ms
  - 48.982s

- **Batch 2 Time**:
  - 49985.51806640625 ms
  - 49.986s

- **Batch 3 Time**:
  - 49059.89990234375 ms
  - 49.060s

- **Average**: 49.343s
- **Total from batch 1-3**: 148.02s

- Fetched player counts for:
  - 1000 apps, 999th appid: 55150
  - 2000 apps, 999th appid: 244910
  - 3000 apps, 999th appid: 287310

- **Fetched player counts for batch ending at index 109587**

- **Total Fetch Time**:
  - 7052983.608154297 ms
  - 1:57:32.984 (h:mm:ss.mmm)
- **Fetched all player counts**

## 5 `const BATCH_SIZE = 1000; const CONCURRENCY_LIMIT = 20;`

- **Batch 1 Time**:
  - 36695.611083984375 ms
  - 36.696s

- **Batch 2 Time**:
  - 50052.155029296875 ms
  - 50.052s

- **Batch 3 Time**:
  - 28288.046875 ms
  - 28.288s

- **Batch 4 Time**:
  - 183150.2119140625 ms
  - 3:03.150 (m:ss.mmm)

- **Batch 5 Time**:
  - 45707.008056640625 ms
  - 45.707s

- **Batch 6 Time**:
  - 38089.936767578125 ms
  - 38.090s

- **Batch 7 Time**:
  - 167868.13598632812 ms
  - 2:47.868 (m:ss.mmm)

- **Total from batch 1-3**: 115.036s

- Fetched player counts for:
  - 1000 apps, 999th appid: 55150
  - 2000 apps, 999th appid: 244910
  - 3000 apps, 999th appid: 287310
  - 4000 apps, 999th appid: 320650
  - 5000 apps, 999th appid: 348910
  - 6000 apps, 999th appid: 374780
  - 7000 apps, 999th appid: 402910

- Could not retrieve player count for:
  - App ID: 290890
  - App ID: 288120
  - App ID: 367220
  - App ID: 379600
  - App ID: 381320

## 6 `const BATCH_SIZE = 1000; const CONCURRENCY_LIMIT = 3;`

- **Batch 1 Time**:
  - 112894.67504882812 ms
  - 1:52.895 (m:ss.mmm)

- **Batch 2 Time**:
  - 99738.533203125 ms
  - 1:39.739 (m:ss.mmm)

- **Batch 3 Time**:
  - 112493.17407226562 ms
  - 1:52.493 (m:ss.mmm)

- **Average**: 108.38s
- **Total from batch 1-3**: 326s

- Fetched player counts for:
  - 1000 apps, 999th appid: 55150
  - 2000 apps, 999th appid: 244910
  - 3000 apps, 999th appid: 287310

## 7 `const BATCH_SIZE = 1000; const CONCURRENCY_LIMIT = 50;`

- **Batch 1 Time**:
  - 54283.94384765625 ms
  - 54.284s

- **Batch 2 Time**:
  - 165267.73583984375 ms
  - 2:45.268 (m:ss.mmm)

- **Batch 3 Time**:
  - 170606.8720703125 ms
  - 2:50.607 (m:ss.mmm)

- Fetched player counts for:
  - 1000 apps, 999th appid: undefined
  - 2000 apps, 999th appid: undefined
  - 3000 apps, 999th appid: undefined

- Could not retrieve player count for:
  - App ID: 57200
  - App ID: 57000
  - App ID: 256030
  - App ID: 257510
