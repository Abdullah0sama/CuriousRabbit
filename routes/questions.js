const router        = require("express").Router({ mergeParams: true });
const User          = require("../models/user.js");
const Question      = require("../models/question.js");
const middlewares   = require("../middleware.js");

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
        console.log(usr, usr == 0, !usr);
        if(!usr) return  Promise.reject({ status: 'failed', msg: 'User not found' }); 

        usr.questions.push(newQuestion);
        return usr.save();

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

// User gets questions unanswered questions
router.get("/question/", (req, res) => {
    var username = req.params.uid;
    
    User.findOne({ username: username }, { password: 0 }).populate({ path: 'questions', match: { isAnswered: false }})
        .then( (usr) => {

            if( usr ) return res.json({ status: 'success', user: usr });
            return res.json({ status: 'failed', msg: 'User not found.' });

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

                question.save().then(

                    res.json({ status: 'success' })

                );
            }else return res.json({ status: 'failed', msg: 'Not authorized' });
        })
        .catch( (err) => res.json({ status: 'failed' }) );
});

module.exports = router;