const router    = require("express").Router();
const User      = require("../models/user.js");

router.get("/u/:uid", function(req, res){
    User.findOne({username: req.params.uid }, { password: 0 }).populate({ path: 'questions', match: {isAnswered: true }})
        .then( (usr) => {
            res.json({ status: 'success', user: usr })
        })
        .catch( (err) => res.json({status: 'error' }) );
})

module.exports = router;