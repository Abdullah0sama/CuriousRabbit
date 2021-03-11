const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/CuriousRabbitDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true})
    .then(() => console.log("Connected Successfully to db"))
    .catch((err) => console.log(err));


const User = require("./models/user.js");
const Question = require("./models/question.js");


var questionsRouter = require("./routes/questions.js");
app.use(questionsRouter);



app.listen(3000, () => {
    console.log("CuriousRabbit server has started!");
})