import dotenv  from "dotenv"
dotenv.config({path:'../.env'})

import fetch from 'node-fetch';
import {generateRandomNumberInVariance} from "../utils/numUtils.js";

export async function createNFTContract(collectionName, collectionSymbol) {
    try {
        let createNFTContract = await fetch("https://api.nftport.xyz/v0/contracts", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": process.env.NFTPORT_API_KEY
            },
            "body": JSON.stringify({
                chain: 'polygon',
                name: collectionName,
                symbol: collectionSymbol,
                owner_address: process.env.OWNER_ADDRESS,
                metadata_updatable: true,
                type: 'erc721',
            })
        })

        let creationResponse = createNFTContract.json()

        return creationResponse
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function augmentAndUploadMetadataToIPFS(metadataList) {
    try {
        let metadataIpfsUriList = []

        for (let metadata of metadataList) {
            metadata.custom_fields = {}
            metadata.custom_fields.unlock_tokens_required = generateRandomNumberInVariance();

            let uploadedMetadata = await fetch("https://api.nftport.xyz/v0/metadata", {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": process.env.NFTPORT_API_KEY
                },
                "body": JSON.stringify(metadata)
            })

            let uploadRes = await uploadedMetadata.json()
            metadataIpfsUriList.push(uploadRes.file_url)
        }

        return metadataIpfsUriList
    } catch (err) {
        console.log(err)
        throw err
    }
}

export async function mintCollection(contractAddress, metadataUriList) {
    try {
        let mintResults = []
        for (let mUri of metadataUriList) {
            let mintRes = await fetch("https://api.nftport.xyz/v0/mints/customizable", {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": process.env.NFTPORT_API_KEY
                },
                "body": JSON.stringify({
                    chain: 'polygon',
                    contract_address: contractAddress,
                    metadata_uri: mUri,
                    mint_to_address: process.env.OWNER_ADDRESS
                })
            })
            mintResults.push(await mintRes.json())
        }

        return mintResults
    } catch (err) {
        console.log(err)
        throw err
    }
}
