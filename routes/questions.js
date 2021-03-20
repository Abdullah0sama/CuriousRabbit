var router = require("express").Router();
var User = require("../models/user.js");
var Question = require("../models/question.js");

const middlewares = require("../middleware.js");

router.post("/u/:uid/question/", (req, res) => {
    var q = new Question(req.body);

    // checks if user is logged in if the question is not sent by anonymous
    if(!q.isAnonymous) {
        if(req.isAuthenticated()) q.whoAsked = req.user;
        else return res.json({status: 'failed', msg: "Not authenticated"});
    }

    User.findOne({username: req.params.uid })
    .then( (usr) => {
        usr.questions.push(q);
        usr.save();
        return usr;
    })
    .then( (usr) => {
            q.user = usr.id;
            console.log(q);
            q.save();
        })
        .catch( (err) => {
            console.log(err);
            return res.send({status: "error"})
        });
    
    return res.json({status: "success"});
})

router.get("/u/:uid/question/", (req, res) => {
    var username = req.params.uid;
    User.findOne({username: username}).populate({path: "questions"})
        .then( (user) => {
            if( user != null ) res.send(user)
            else res.send({status: "no user with that name"});
        })
        .catch( (err) => console.log(err) );
})
    
//To answer the question
router.post("/u/:uid/question/:qid/",middlewares.isAuthenticated, function(req, res){
    Question.findOne({_id: req.params.qid})
        .then( (q) => {
            if( q == null ) return res.json({status: "failed"});

            //If the user is the owner of the question
            if(q.user.equals(req.user._id)){
                q.answer = req.body.answer;
                q.isAnswered = true;
                q.save().then(
                    res.json({status: "success"})
                );
            }else return res.json({status: "failed"});
        })
        .catch( (err) => console.log(err) );
});

module.exports = router;