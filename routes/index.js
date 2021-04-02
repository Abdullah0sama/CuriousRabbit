const router        = require("express").Router();
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const saltRounds    = 10;
const middlewares   = require("../middleware.js");
const User          = require("../models/user");
const FriendShip    = require('../models/friendship');



//      Rendering pages
// --------------------------------------------------------------------------------------------------------

router.get('/', function(req, res){
    if(!req.user) return res.redirect('/discover');
    res.render('index.ejs');
});

router.get('/discover', function(req, res){
    res.render('discover.ejs');
});

// Rendering login page
router.get('/login', middlewares.isUnauthenticated, function(req, res){
    res.render('login.ejs');
});

// Rendering Registeration page
router.get('/register', middlewares.isUnauthenticated, function(req, res){
    res.render('register.ejs');
});

// Rendering Inbox(unanwnseredQuestions) page 
router.get('/inbox', middlewares.isAuthenticated, function(req, res){
    res.render('inbox.ejs');
});

// --------------------------------------------------------------------------------------------------------



//Registeration route for user
router.post("/register", async function(req, res){
    let user = req.body.user;
    console.log(user);
    await bcrypt.hash(user.password, saltRounds).then( hashed => {
        user.password = hashed;
    }).catch( err => console.log(err));

    User.create(user).then( u => res.redirect('/login'))
    .catch(err => {
        console.log(err);
        res.redirect('/register');
    });

})

router.post("/login",passport.authenticate('local', {failureRedirect:"/login"}), function(req, res){
    res.redirect('/');
});



// Ends user's session
router.post("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});


module.exports = router;