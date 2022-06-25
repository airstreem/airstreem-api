import "dotenv/config";
import express from "express";
import {mint} from "./routes/createStream.js";
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({"message": "welcome to airstreem api"})
});

app.all('/mint', mint)

// starting the server
let PORT = 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
