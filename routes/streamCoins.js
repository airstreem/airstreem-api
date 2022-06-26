import dotenv from "dotenv"
import {BigNumber, ethers} from "ethers"
import {Framework} from "@superfluid-finance/sdk-core";
import {getMongoDbClient} from "../db/mongo.js";
import {ObjectID} from "mongodb";

dotenv.config({path:'../.env'})

async function startFlow(holderAddress, contractAddress) {

    let provider = new ethers.providers.JsonRpcProvider(process.env.MATIC_PROVIDER_URL);
    const sf = await Framework.create({
        networkName: "polygon-mumbai",
        provider: provider,
        customSubgraphQueriesEndpoint: "",
        dataMode: "WEB3_ONLY"
    });

    const signer = sf.createSigner({
        privateKey:process.env.PRIVATE_KEY,
        provider: provider
    });

    const tokenContract = await sf.loadSuperToken(contractAddress);

    // Todo vary
    let flowRate = (BigNumber.from("5").mul(BigNumber.from("1000000000000000000"))).toString()

    try {
        const createFlowOperation = sf.cfaV1.createFlow({
            flowRate: flowRate,
            receiver: holderAddress,
            superToken: tokenContract.address
            // userData?: string
        });

        const result = await createFlowOperation.exec(signer);
        console.log(
            `Stream created at https://app.superfluid.finance/dashboard/${holderAddress}`
        );

        return result.hash

    } catch (error) {
        console.error(error);
    }
    return null
}

export async function streamCoins(req, res, err) {

    let id = req.body.id.toString()

    let mongoClient = await getMongoDbClient();
    let job = await mongoClient.collection('jobs').findOne(
        {_id: ObjectID(id)}
    );

    if (!job) {
        res.status(400).json({"error": "Invalid arguments. job with ID does not exist"});
        return
    }

    try {

        let holders = job.parentHolders;
        let coinContract = job.coinContract

        let addressToFlowHash = {}

        for (let address of holders) {
            addressToFlowHash[address] = await startFlow(address, coinContract)
        }

        let updatedJob = await mongoClient.collection('jobs').findOneAndUpdate(
            {"_id":ObjectID(id)},
            {
                $set:{
                    "addressToFlowHash" : addressToFlowHash,
                }
            },
            {new: true}
        );

        return res.json({...updatedJob})

    } catch (err) {
        console.error(`${err}`)
        return res.status(400).json({"error":err})
    }
}
