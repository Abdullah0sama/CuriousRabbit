const router        = require("express").Router();
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const saltRounds    = 10;
const middlewares   = require("../middleware.js");
const User          = require("../models/user");
const FriendShip    = require('../models/friendship');
const Question      = require('../models/question');


//      Rendering pages
// --------------------------------------------------------------------------------------------------------

router.get('/', function(req, res){
    if(!req.user) return res.redirect('/discover');
    res.render('index.ejs');
});

router.get('/discover', function(req, res){
    res.render('discover.ejs');
});

router.get('/login', middlewares.isUnauthenticated, function(req, res){
    res.render('login.ejs');
});

router.get('/register', middlewares.isUnauthenticated, function(req, res){
    res.render('register.ejs');
});

router.get('/inbox', middlewares.isAuthenticated, function(req, res){
    res.render('inbox.ejs');
});

// --------------------------------------------------------------------------------------------------------



//Registeration route for user
router.post("/register", async function(req, res){
    let user = req.body.user;
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

// Getting user's feed
router.get('/feed', middlewares.isAuthenticated, function(req, res){
    FriendShip.aggregate([
        {$match : {follower: req.user._id} },
        {$lookup:{
            from: 'users',
            let: {userId: '$followed'},
            pipeline:[
                {$match: {$expr: 
                {
                    $eq:['$_id', '$$userId']
                }
                }},
                {$project: {
                    password: 0
                }}
            ],
            as: 'followed'
        },
        },
        {$set: {
            followed: {$arrayElemAt:['$followed', 0]}
        }},

        {$lookup: {
            from: 'questions',
            let: {followedId: '$followed._id', user: '$followed'},
            pipeline: [
                {$match : {$expr: 
                    {$and:
                        [
                            {$eq: ['$user', '$$followedId']},
                            {$eq: ['$isAnswered', true]}
                        ]
                    }
                }},
                {$set: {
                    'user': '$$user'
                }}
            ],
            as: 'questions'
        }},

        {$unwind: '$questions'},
        {$replaceRoot: {newRoot: '$questions'}},
        
        {$lookup:{
            from: 'users',
            let: {userId: '$whoAsked'},
            pipeline:[
                {$match: {$expr: 
                {
                    $eq:['$_id', '$$userId']
                }
                }},
                {$project: {
                    password: 0
                }}
            ],
            as: 'whoAsked'
        },
        },
        {$set: {
            whoAsked: {$arrayElemAt:['$whoAsked', 0]}
        }},
        {$sort : {
            'date': -1
        }}
    ])
    .then(feed => res.json({status: 'success', feed: feed }))
    .catch(err => res.json({status: 'error' }));
});

// Get random 10 answered question
router.get('/discoverFeed', function(req, res){
    Question.aggregate([
        {$match: {isAnswered: true}}, 
        {$sample: {size: 5}},

        {$lookup:{
            from: 'users',
            let: {userId: '$whoAsked'},
            pipeline:[
                {$match: {$expr: 
                {
                    $eq:['$_id', '$$userId']
                }
                }},
                {$project: {
                    password: 0
                }}
            ],
            as: 'whoAsked'
        },},

        {$lookup:{
            from: 'users',
            let: {userId: '$user'},
            pipeline:[
                {$match: {$expr: 
                {
                    $eq:['$_id', '$$userId']
                }
                }},
                {$project: {
                    password: 0
                }}
            ],
            as: 'user'
        },},

        {$set: {
            whoAsked: {$arrayElemAt:['$whoAsked', 0]},
            user: {$arrayElemAt:['$user', 0]}
        }},

        {$sort: { date: -1 }}
    ])
    .then(feed => res.json({ status: 'success', feed: feed}))
    .catch(err => res.json({ status: 'error' }))
});
module.exports = router;