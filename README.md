#airstreem-api

### Setup
* `cp .env.sample .env` and add keys
* `npm i`
* `npm start`

### Endpoints

# airstreem-api

### Endpoints

1. POST `/createNFTs`
```
curl --location --request POST 'localhost:3001/createNFTs' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "yupnew",
    "symbol": "aha",
    "parent_holders": [
        "0x80d2ab2b94969204ccfc86267ef09d8010e1b8b8",
        "0x80d2ab2b94969204ccfc86267ef09d8010e1b8b8"
    ],
    "child_metadata": [
        {
            "name": "test1",
            "description": "test3",
            "file_url": "https://ipfs.io/ipfs/QmRModSr9gQTSZrbfbLis6mw21HycZyqMA3j8YMRD11nAQ"
        },
        {
            "name": "test4",
            "description": "test1",
            "file_url": "https://ipfs.io/ipfs/QmRModSr9gQTSZrbfbLis6mw21HycZyqMA3j8YMRD11nAQ"
        }
    ]
}'
```

2. POST `/createCoins`
```
{
    "id": "<insertedId>"
}
```