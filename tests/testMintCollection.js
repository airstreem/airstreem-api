import dotenv  from "dotenv"
dotenv.config({path:'../.env'})
import {createNFTContract} from "../service/nft.js";
import {makeId} from "../utils/numUtils.js";
import {createNFTs} from "../routes/createNFTs.js";

let collectionName = ('testairstreem' + makeId(4)).toUpperCase();
let collectionSymbol = ('TASM' + makeId(2)).toUpperCase();

let res, err = await createNFTContract(collectionName, collectionSymbol)
console.log(err)

await createNFTs(
    {
        body: {
            name:('testairstreem' + makeId(4)).toUpperCase(),
            symbol:('TASM' + makeId(2)).toUpperCase(),
            collection: [
                {
                    "name": "test1",
                    "description": "test1",
                    "file_url": "https://ipfs.io/ipfs/QmRModSr9gQTSZrbfbLis6mw21HycZyqMA3j8YMRD11nAQ"

                },
                {
                    "name": "test2",
                    "description": "test1",
                    "file_url": "https://ipfs.io/ipfs/QmRModSr9gQTSZrbfbLis6mw21HycZyqMA3j8YMRD11nAQ"

                }
            ]

        }
    }
)