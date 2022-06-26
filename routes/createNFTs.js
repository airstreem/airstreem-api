import dotenv  from "dotenv"
dotenv.config({path:'../.env'})

import {augmentAndUploadMetadataToIPFS, createNFTContract, mintAllNftsInCollection} from "../service/nft.js";
import {getMongoDbClient} from "../db/mongo.js";

export async function createNFTs(req, res, err) {
    try {

        let data = req.body

        let name = data.name
        let symbol = data.symbol
        let childCollectionMetadata = data.child_metadata
        let parentHolders = data.parent_holders

        if (!name || !symbol || !childCollectionMetadata || !parentHolders) {
            res.status(400).json({"error":"name, symbol, child_metadata, parent_holders should be passed"})
            return
        }
        if (childCollectionMetadata.length !== parentHolders.length) {
            res.status(400).json({"error":"child_metadata and parent_holders should be same length"})
            return
        }

        // let contractAddress = await createNFTContract(name, symbol)
        let contractAddress = "0x80d2ab2b94969204ccfc86267ef09d8010e1b8b8"
        let uploadedMetadataList = await augmentAndUploadMetadataToIPFS(childCollectionMetadata)
        let mintedCollection = await mintAllNftsInCollection(contractAddress, uploadedMetadataList)

        let mongoClient = await getMongoDbClient();
        let createdJob = await mongoClient.collection('jobs').insertOne({
            name,
            symbol,
            mintedCollection,
            parentHolders
        })

        return res.json({name, symbol, childCollection:mintedCollection, parentHolders, ...createdJob})
    } catch (err) {
        console.error(`${err}`)
        return res.status(400).json({"error":err})
    }
}
