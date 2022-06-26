import dotenv  from "dotenv"
dotenv.config({path:'../.env'})
const { exec } = require("child_process");

export async function createCoins(req, res, err) {

    exec("truffle deploy --network mumbai", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
    });

    return res.json(createdJob)
}
