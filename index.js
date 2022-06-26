import "dotenv/config";
import express from "express";
import cors from "cors"

import {createNFTs} from "./routes/createNFTs.js";
import {createCoins} from "./routes/createCoins.js";
import {streamCoins} from "./routes/streamCoins.js";

const app = express();
app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
    res.json({"message": "welcome to airstreem service"})
});


app.all('/createNFTs', createNFTs)
app.all('/createCoins', createCoins)
app.all('/streamCoins', streamCoins)

// starting the server
let PORT = 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
