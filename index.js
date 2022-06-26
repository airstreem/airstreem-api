import "dotenv/config";
import express from "express";
import {mintCollection} from "./routes/mintCollection.js";
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({"message": "welcome to airstreem service"})
});

app.all('/createCoins', mintCollection)
app.all('/createTokens', mintCollection)

// starting the server
let PORT = 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
