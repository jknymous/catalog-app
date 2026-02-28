const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API jalan bro");
});

app.listen(5000, () => console.log("Server jalan di port 5000"));