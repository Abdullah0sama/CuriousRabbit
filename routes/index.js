const router = require("express").Router();
const bcrypt = require("bcrypt");
const { session } = require("passport");
const passport = require("passport");
const saltRounds = 10;

const User = require("../models/user");

//Registeration route for user
router.post("/register", async function(req, res){
    let user = req.body;

    await bcrypt.hash(user.password, saltRounds).then( hashed => {
        user.password = hashed;
    }).catch( err => console.log(err));

    User.create(user).then( u => res.send(u))
    .catch(err => {
        console.log(err);
        res.send("error");
    });

})

router.post("/login",passport.authenticate('local', {failureRedirect:"/login"}), function(req, res){
    console.log(req.body);
    res.send("done");
    console.log(req.user);
});

router.get("/secret", isAuthenticated, function(req, res){
    res.send("this is protected");
})
router.get("/", function(req, res){
    console.log(req.session);
    res.send("dione");
})
//Checks if users are Authenticated if not redirects them to login page
function isAuthenticated(req, res, next){
    if(!req.isAuthenticated()) {
            res.redirect("/login");
    }else{
        next();
    }
}

//Checks if users are unAuthenticated if not redirects them to index page
function isUnauthenticated(req, res, next){
    if(req.isAuthenticated()) {
            res.redirect("/");
    }else{
        next();
    }
}
// Ends user's session
router.post("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
})
module.exports = router;