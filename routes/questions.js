var router = require("express").Router();
var User = require("../models/user.js");
var Question = require("../models/question.js");
const question = require("../models/question.js");

router.post("/u/:uid/question/new", (req, res) => {
    let ques = {};
    ques.content = req.body.content;
    ques.anonymous = req.body.anonymous;
    var q = new question(ques);

    User.findOne({username: req.params.uid })
        .then( (usr) => {
            usr.questions.push(q);
            usr.save();
            return usr;
        })
        .then( (usr) => {
            ques.user = usr._id;
            q.save();
        })
        .catch( (err) => {
            console.log(err);
            res.send({status: "Error"})
        });
    
    res.send({status: "Success"});
})
router.get("/u/:uid/question/", (req, res) => {
    var username = req.params.uid;
    User.findOne({username: username}).populate({path: "questions"})
        .then( (user) => {
            if( user != null ) res.send(user)
            else res.send({status: "no user with that name"});
        })
        .catch( (err) => console.log(err) );
    // res.send(req.params);
})
    


module.exports = router;