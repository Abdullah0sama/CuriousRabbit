const express = require("express");
const app = express();
const mongoose = require("mongoose");


app.get("/", (req, res) => {
    res.send("Hello to CuriousRabbit");
})


app.listen(3000, () => {
    console.log("CuriousRabbit server has started!");
})