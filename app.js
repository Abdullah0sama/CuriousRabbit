const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/CuriousRabbitDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true})
    .then(() => console.log("Connected Successfully to db"))
    .catch((err) => console.log(err));

const User = require("./models/user.js");
const Question = require("./models/question.js");





app.listen(3000, () => {
    console.log("CuriousRabbit server has started!");
})