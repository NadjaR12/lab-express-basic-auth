// require session
//this is a middleware
const session = require('express-session');
const app = require('../app');

// export this middleware to app.js
module.exports = app => {

    app.set('trust proxy', 1)

// use session
app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // === 1 Tag eingeloggt
      }
    })
  );
}

