import dotenv  from "dotenv"
dotenv.config({path:'../.env'})

import {augmentAndUploadMetadataToIPFS, createNFTContract, mintAllNftsInCollection} from "../service/nft.js";
import {getMongoDbClient} from "../db/mongo.js";

export async function createNFTs(req, res, err) {
    try {

        let data = req.body

        let name = data.name
        let symbol = data.symbol
        let collection = data.collection

        // let contractAddress = await createNFTContract(name, symbol)
        let contractAddress = "0x80d2ab2b94969204ccfc86267ef09d8010e1b8b8"
        let uploadedMetadataList = await augmentAndUploadMetadataToIPFS(collection)
        let mintedCollection = await mintAllNftsInCollection(contractAddress, uploadedMetadataList)

        let mongoClient = await getMongoDbClient();
        let createdJob = await mongoClient.collection('jobs').insertOne({
            name,
            symbol,
            mintedCollection
        })
        console.log(createdJob)

        return res.json({name, symbol, mintedCollection, ...createdJob})
    } catch (err) {
        console.error(`${err}`)
        return res.status(400).json({"error":err})
    }
}
