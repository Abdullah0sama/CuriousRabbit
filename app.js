const express           =   require("express");
const app               =   express();
const mongoose          =   require("mongoose");
const bodyParser        =   require("body-parser");
const passport          =   require("passport");
const localStrategy     =  require("passport-local").Strategy;

const session_secret = process.env.CR_session;
const session = require("express-session");
app.use(session({
    secret: session_secret,
    name: 'curiousrabbit',
    saveUninitialized: false,
    resave: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://localhost/CuriousRabbitDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true})
.then(() => console.log("Connected Successfully to db"))
.catch((err) => console.log(err));

const User = require("./models/user.js");
const Question = require("./models/question.js");


// Authentication setup
passport.use(new localStrategy(
    function(username, password, done){
        return User.findOne({username: username}).then( usr => {
            if(!usr) return done(null, false);
            if(!bcrypt.compareSync(password, usr.password)) return done(null, false);
            return done(null, usr);
        }).catch(err => {return done(err)});
    }
));
    
passport.serializeUser(function(usr, done){
    done(null, usr._id);
});

passport.deserializeUser(function(id, done){
    User.findById(id).then(usr => done(null, usr))
    .catch(err => done(err));
});

app.use(passport.initialize());
app.use(passport.session());

// Getting required routers

let questionsRouter = require("./routes/questions.js");
app.use("/u/:uid", questionsRouter);

let indexRouter = require("./routes/index.js");
app.use(indexRouter);

let userRouter = require("./routes/user.js");
app.use(userRouter);

app.listen(3000, () => {
    console.log("CuriousRabbit server has started!");
});