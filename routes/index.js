const router = require("express").Router();

// /* GET home page */
// router.get("/", (req, res, next) => {
//   res.render("index");
// });


// middleware to protect a route
function loginCheck() {
return( req, res, next) => {
    if (req.session.user){
        next()
    } else {
            res.redirect('/login', {error: 'Please log in to get access to this side'})
    }
}
}

module.exports = router;
