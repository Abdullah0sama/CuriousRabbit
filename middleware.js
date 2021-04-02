const middlewares = {};

// Checks if users are Authenticated if not redirects them to login page
middlewares.isAuthenticated = function (req, res, next){
    if(!req.isAuthenticated()) {
            // res.json({ status: 'failed', msg: 'Not authenticated' });
            res.redirect('/login');
    }else{
        next();
    }
}

// Checks if users are unAuthenticated if not redirects them to index page
middlewares.isUnauthenticated = function (req, res, next){
    if(req.isAuthenticated()) {
            // res.json({ status: 'failed', msg: 'authenticated' });
            res.redirect('/');
    }else{
        next();
    }
}

module.exports = middlewares;