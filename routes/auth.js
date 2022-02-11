const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User.model.js')

// Iteration #3 middleware to protect a route
function loginCheck() {
    return( req, res, next) => {
        if (req.session.user){
            next()
        } else {
            res.redirect('/login', {error: 'Please log in to get access to this side'})
        }
    }
    }

router.get('/login', (req, res, next) => {
    res.render('login');
})

// Iteration #1: Signup
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

// Iteration #3: Protected Routes
router.get('/main', (req, res, next) => {
    res.render('main');
})
// middleware function aufgerufen => private kann nur besuchtw erden, wenn user eingeloggt ist
router.get('/private',loginCheck(), (req, res, next) => {
    res.render('private')
})

// Iteration #2: Login Authentication
router.post('/login', (req, res, next) =>{
    const { username, password } = req.body
     User.findOne({ username: username })
        .then(user => {
// wenn user nicht existiert error 'User is not registered'
             if (!user) {
                 res.render('login', {error: 'User is not registered'})
// zurück zu login
             return;
// wenn password mit user.passwordHash übereinstimmt direct to /userProfile
             } 
             if (bcrypt.compareSync(password, user.password)) {
                 req.session.currentUser = user;
                 res.redirect('/private')
             } else {
// sonst zurück zu login
                 res.render('login', { error: 'Incorrect password' })
             }
         })
         .catch(error => next(error));
 });

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body
    if(username === '' || password === ''){
        res.render('signup', {message: 'Pls fill out all fields'})
        return 
    }
    User.findOne({username: username})
        .then (userFromDB => {
    if (userFromDB !== null) {
        res.render('signup', {message: "Username is already taken"})
    } else {	
        // we can use that username
        // and hash the password
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(password, salt)
        // create the user
        User.create({ username, password: hash })
            .then(createdUser => {
                console.log(createdUser)
                res.redirect('/login')
            })
            .catch(err => next(err))
        }
    })
});

router.get('/logout', (req, res, next) => {
	// to log the user out we destroy the session
	req.session.destroy()
	res.render('index')
});

module.exports = router;