// import dotenv  from "dotenv"
// dotenv.config({path:'../.env'})
import ethers from "ethers"
import { Framework } from "@superfluid-finance/sdk-core";
// import {getMongoDbClient} from "../db/mongo.js";
import {ObjectID} from "mongodb";

async function startFlow(holderAddress, contractAddress) {

    let provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/t6DAudJZCSmbPijYTjG4GA2Ga25GYNTU');
console.log(provider)

    const sf = await Framework.create({
        // chainId: (await provider.getNetwork()).chainId,
        networkName: "polygon-mumbai",
        provider: provider,
        customSubgraphQueriesEndpoint: "",
        dataMode: "WEB3_ONLY"
    });

    console.log(sf)

    const signer = sf.createSigner({
        privateKey:process.env.PRIVATE_KEY,
        provider: provider
    });

    const tokenContract = await sf.loadSuperToken(contractAddress);
    let flowRate = 10

    try {
        const createFlowOperation = sf.cfaV1.createFlow({
            flowRate: flowRate,
            receiver: holderAddress,
            superToken: tokenContract.address
            // userData?: string
        });

        console.log("Creating your stream...");

        const result = await createFlowOperation.exec(signer);
        console.log(result);
        console.log(
            `Congrats - you've just created a money stream!
            View Your Stream At: https://app.superfluid.finance/dashboard/${holderAddress}
            Network: Mumbai
            Super Token: ${tokenContract}
            Sender: ${process.env.OWNER_ADDRESS}
            Receiver: ${holderAddress},
            FlowRate: ${flowRate}`
        );

    } catch (error) {
        console.log(
            "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
        );
        console.error(error);
    }

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
        for (let address of holders) {
            await startFlow()
        }

        return res.json({name, symbol, childCollection:mintedCollection, parentHolders, ...createdJob})
    } catch (err) {
        console.error(`${err}`)
        return res.status(400).json({"error":err})
    }
}

await startFlow("0x283C74394c64Dea1979DAABe0753DFe4BF203489", "0x8C4E7adBa2e071df3db0CECc458AD930B0090040")
