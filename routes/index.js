const router = require("express").Router();
const bcrypt = require("bcrypt");

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

module.exports = router;