import dotenv  from "dotenv"
dotenv.config({path:'../.env'})

import {augmentAndUploadMetadataToIPFS, createChildCollectionNFTContract, mintAllChildNftsInCollection} from "../service/nft.js";
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


        // NOTE: This address is for the demo. IRL we want to get a new contract address
        // for each new collection with its unique name and token
        let contractAddress = await createChildCollectionNFTContract(name, symbol)

        let uploadedMetadataList = await augmentAndUploadMetadataToIPFS(childCollectionMetadata)
        let mintedCollection = await mintAllChildNftsInCollection(contractAddress, uploadedMetadataList)

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
