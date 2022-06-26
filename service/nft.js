import dotenv  from "dotenv"
dotenv.config({path:'../.env'})

import fetch from 'node-fetch';
import {generateRandomNumberInVariance} from "../utils/numUtils.js";

export async function createChildCollectionNFTContract(collectionName, collectionSymbol) {
    try {

        // Create NFT contract

        // TODO: Remove for demo

        // let createNFTContract = await fetch("https://api.nftport.xyz/v0/contracts", {
        //     "method": "POST",
        //     "headers": {
        //         "Content-Type": "application/json",
        //         "Authorization": process.env.NFTPORT_API_KEY
        //     },
        //     "body": JSON.stringify({
        //         chain: 'polygon',
        //         name: collectionName,
        //         symbol: collectionSymbol,
        //         owner_address: process.env.OWNER_ADDRESS,
        //         metadata_updatable: true,
        //         type: 'erc721',
        //     })
        // })
        //
        // let creationResponse = await createNFTContract.json()
        // let txnHash = creationResponse.transaction_hash

        let txnHash = "0xb34d089358a0ea0cfd9af4241398efff5bf096520b5196e3aaa026a75ce1dd42"
        console.log(`txn hash is ${txnHash}`)

        // Get NFT contract address
        let nftCreationDetails = await fetch(`https://api.nftport.xyz/v0/contracts/${txnHash}?chain=polygon`, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": process.env.NFTPORT_API_KEY
            }
        })
        let nftDescription = await nftCreationDetails.json()
        let contractAddress = nftDescription.contract_address

        while (!contractAddress) {
            let nftCreationDetails = await fetch(`https://api.nftport.xyz/v0/contracts/${txnHash}?chain=polygon`, {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": process.env.NFTPORT_API_KEY
                }
            })
            nftDescription = await nftCreationDetails.json()
            contractAddress = nftDescription.contract_address
        }

        console.log(`Creation address is ${nftCreationDetails}, address is ${contractAddress}`)
        return contractAddress

    } catch (err) {
        console.log(err)
        return "0xb34d089358a0ea0cfd9af4241398efff5bf096520b5196e3aaa026a75ce1dd42"
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

export async function mintAllChildNftsInCollection(contractAddress, metadataUriList) {
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
