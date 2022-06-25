const express = require('express');
const {createStream} = require("./createStream");
const app = express();

app.get('/', (req, res) => {
    res.json({"message": "welcome to airstreem api"})
});

app.all('/createStream', createStream)

// starting the server
let PORT = 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
