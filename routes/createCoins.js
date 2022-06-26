import dotenv  from "dotenv"
dotenv.config({path:'../.env'})
import {exec} from "child-process-promise"
import {getMongoDbClient} from "../db/mongo.js";
import {ObjectID} from "mongodb";

export async function createCoins(req, res, err) {

    // Validation
    if (!req.body.id) {
        res.status(400).json({"error": "Invalid arguments. id of collection created must be passed"});
        return
    }

    try {

        let id = req.body.id.toString()

        let mongoClient = await getMongoDbClient();
        let job = await mongoClient.collection('jobs').findOne(
            {_id: ObjectID(id)}
        );

        if (!job) {
            res.status(400).json({"error": "Invalid arguments. job with ID does not exist"});
            return
        }

        let coinName = job.name + 'Token'
        let coinSymbol = ('ast' + job.symbol).trim()

        let receiver = process.env.OWNER_ADDRESS
        let network = "mumbai"

        // Execute truffle to deploy the contract
        const execRes = await exec(`json -I -f package.json -e 'this.type=\"commonjs\"' &&
          truffle exec migrations/1_initial_migration.js --network ${network} && 
          json -I -f package.json -e 'this.type=\"module\"'\n`,
            {env: {'name': coinName, 'symbol':coinSymbol, 'receiver':receiver}}
        )
    console.log(execRes.stderr)

        // Get the address contract is deployed at
        let stdout = execRes.stdout
        let deployArr = stdout.substring(
            stdout.lastIndexOf("Deployed at:"),
            stdout.indexOf("Initialize")
        ).split(" ")
        let deployedContract = deployArr[deployArr.length - 1]

        // Update job in database
        let updatedJob = await mongoClient.collection('jobs').findOneAndUpdate(
            {"_id":id},
            {
                "coinContract" : deployedContract,
                "coinName": coinName,
                "coinSymbol" : coinSymbol
            },
            {new: true}
        );

        return res.json(updatedJob)

    } catch(err) {
        console.log(`err - ${err}`)
        await exec(`json -I -f package.json -e 'this.type=\"module\"'`)
        res.status(400).json({"error": `${err}`})
    }
}
