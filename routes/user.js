const router        = require("express").Router({ mergeParams:true });
const middleware    = require('../middleware.js');

const User          = require("../models/user.js");
const Friendship    = require('../models/friendship.js');
const Question      = require('../models/question');

// Save the document of the user beibng visited with 'uid' username as it is needed in all calls to this route
router.use((req, res, next) => {
    User.findOne({username: req.params.uid})
        .then((usr) => {
            if(!usr) return res.json({ status: 'failed', msg: 'No user with this name.' });
            req.visitedUser = usr;
            next();
        })
        .catch(err => console.log(err));
});

// Gets  visited user answered questions
router.get('/', function(req, res){
    Question.find({user: req.visitedUser._id, isAnswered: true})
        .then( (usr) => {
            res.json({ status: 'success', user: usr });
        })
        .catch( (err) => res.json({status: 'error' }) );
});



// Gets the the status of the friendship between the vistied user and the visiting user
router.get('/follow', middleware.isAuthenticated, function(req, res){

    let follow = {
        followed: req.visitedUser._id,
        follower: req.user._id
    };

    Friendship.findOne(follow)
        .then( (status) => res.json({ status: 'success', isFollowed: Boolean(status) }))
        .catch(err => res.json({ status: 'error' }));
});

// The authenticated user follows the user whose username is 'uid' 
router.post('/follow' ,middleware.isAuthenticated , function(req, res){

    let follow = {
        followed: req.visitedUser._id,
        follower: req.user._id
    };

    // Checks if the user is following himself
    if(follow.followed === follow.follower) return res.json({ status: 'failed', msg: 'User following himself.' });

    Friendship.create(follow)
        .then( (status) => {
            console.log(status);
            // Increment followed user's followers count
            User.findByIdAndUpdate(follow.followed, {$inc: {followers: 1}}).exec();
            // Increment following user following count
            User.findByIdAndUpdate(follow.follower, {$inc: {following: 1}}).exec();

            res.json({ status:'success' })
        })
        .catch( err => res.json({ status: 'error' }));
});

// The visiting user unfollows the visited user 
router.post('/unfollow', middleware.isAuthenticated, function(req, res){

    let follow = {
        followed: req.visitedUser._id,
        follower: req.user._id
    };

    Friendship.findOneAndDelete(follow)
        .then( (status) => {

            // Checks if no changes have occurred.
            if(!status) return res.json({ status: 'failed', msg: 'The user wasn\'t followed.' });
            // Decrement followed user's followers count
            User.findByIdAndUpdate(follow.followed, {$inc: {followers: -1}}).exec();
            // Decrement following user's following count
            User.findByIdAndUpdate(follow.follower, {$inc: {following: -1}}).exec();

            res.json({ status: 'success' });
        })
        .catch( err => res.json({ status: 'error' }));
});

// Gets user's followers list
router.get('/followers', function(req, res){
        help({
            match: 'followed',
            id: req.visitedUser._id,
            find: 'follower' 
        })
        .then( followers => res.json({ status: 'success', followers: followers}))
        .catch ( err => res.json({ status: err }));
});

// Gets user's following list
router.get('/following', function(req, res){
    help({
        match: 'follower',
        id: req.visitedUser._id,
        find: 'followed'
    })
        .then( following => res.json({ status: 'success', following: following}))
        .catch ( err => res.json({ status: 'error' }));
});

function help(option){
    return Friendship.aggregate([
        {$match: { [option.match] : option.id}},
        {$lookup: {
            from: 'users',
            localField: option.find,
            foreignField: '_id',
            as: 'user'
        }},
        {
            $replaceRoot: { newRoot: {
                    $arrayElemAt: ['$user', 0],
            }}
        },
        {$group: {
            _id: null,
            count: {$sum : 1},
            usernames: {$push: '$username'}
        }},
        {$project: {
            _id: 0,
        }}
    ])
}

module.exports = router;