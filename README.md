#airstreem-api

### Setup
* `cp .env.sample .env` and add keys
* `npm i`
* `npm install -g truffle json`
* `npm start`

### Endpoints

# airstreem-api

### Endpoints

1. POST `/createNFTs` and pull out `insertedId`. Metadata is uploaded to IPFS and returned as part of response
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

2. POST `/createCoins`. `value.coinContract` is the contract to which tokens backing the NFT are minted
```
{
    "id": "<insertedId>"
}
```