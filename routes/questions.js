const router        = require("express").Router({ mergeParams: true });
const User          = require("../models/user.js");
const Question      = require("../models/question.js");
const middlewares   = require("../middleware.js");
const Like          = require('../models/likes');
router.post("/question/", (req, res) => {

    var newQuestion = new Question(req.body);
    // Checks if the user is authenticated if the question is not sent by isAnonymous is set to false
    if(!newQuestion.isAnonymous) {
        if(req.isAuthenticated()) newQuestion.whoAsked = req.user;
        else return res.json({ status: 'failed', msg: 'Not authenticated' });
    }

    // Finds the user adds reference of the question in its model and references the user in the question
    User.findOne({username: req.params.uid })
    .then( (usr) => {

        // If the user is not found
        if(!usr) return  Promise.reject({ status: 'failed', msg: 'User not found' }); 

        return usr;

    })
    .then( usr => {
        newQuestion.user = usr.id;
        return newQuestion.save();
    })
    .then( () => {
        return res.json({ status: 'success' });
    })
    .catch( (err) => {
        if( err.status != 'failed' ) res.json({ status: 'error' });
        else res.json({ err });
    })
    

});

// User gets unanswered questions
router.get("/question/", middlewares.isAuthenticated, (req, res) => {
    var username = req.params.uid;
    
    if(req.user.username != username) return res.json({ status: 'failed', msg: 'Not authorized'});
    
    Question.find({user: req.user._id, isAnswered: false}, null, {sort : {date:-1}}).populate({path: 'whoAsked', select: 'username'})
        .then( (questions) => {
            return res.json({ status: 'success', questions: questions });
        })
        .catch( (err) => res.json({ status: 'error' }) );
});
    

// User answers an unanswered question
router.post("/question/:qid/", middlewares.isAuthenticated, function(req, res){ 

    Question.findOne({_id: req.params.qid})
        .then( (question) => {

            if( !question ) return res.json({ status: 'failed', msg: 'Question not found' });

            // Checks if the user is the same as the owner of the question
            if( question.user.equals(req.user._id) ){

                question.answer = req.body.answer;
                question.isAnswered = true;
                question.date = Date.now();
                question.save().then(

                    res.json({ status: 'success' })

                );
            }else return res.json({ status: 'failed', msg: 'Not authorized' });
        })
        .catch( (err) => res.json({ status: 'failed' }) );
});



// Gets user status if he liked the question or not
router.get('/question/:qid/like', middlewares.isAuthenticated, function(req, res){

    let like = {
        question: req.params.qid,
        user: req.user._id
    };
    let likeStatus = {};

    Like.findOne(like)
        .then(status => {
            likeStatus.isLiked = Boolean(status);
            return Question.findById(like.question)

        })
        .then(question => {
            likeStatus.count = question.likes;
            res.json({ status: 'success', likeStatus: likeStatus});
        })
        .catch(err => res.json({ status: 'success' }));
});

router.post('/question/:qid/like', middlewares.isAuthenticated, function(req, res){

    let like = {
        question: req.params.qid,
        user: req.user._id
    };

    Like.create(like)
        .then(status => {

            //  Increment likes in question
            Question.findByIdAndUpdate(like.question, {$inc: { 'likes': 1 } }).exec();

            res.json({ status: 'success' });
        })
        .catch(err => res.json({ status: 'error' }))
});

router.post('/question/:qid/unlike', middlewares.isAuthenticated, function(req, res){

    let like = {
        question: req.params.qid,
        user: req.user._id
    };

    Like.findOneAndDelete(like)
        .then(status => {

            if(!status) return res.json({ status: 'failed', msg: 'Already not liked.' });

            //  Decrement likes
            Question.findByIdAndUpdate(like.question, {$inc: { 'likes': -1 } }).exec();

            res.json({ status: 'success' });
        })
        .catch(err => res.json({ status: 'error' }))
});


module.exports = router;