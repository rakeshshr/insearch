// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Favorites = require('./models/favorites'),
    User = require('./models/user'),
    session = require('express-session');

// connect to mongodb
mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/hash_it'
);

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 600000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});

// STATIC ROUTES

// homepage
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// profile page
app.get('/profile', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    // show profile if logged-in user
    if (user) {
      res.sendFile(__dirname + '/public/views/profile.html');
    // redirect if no user logged in
    } else {
      res.redirect('/');
    }
  });
});


// profile page
app.get('/favorites', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    // show profile if logged-in user
    if (user) {
      res.sendFile(__dirname + '/public/views/favorites.html');
    // redirect if no user logged in
    } else {
      res.redirect('/');
    }
  });
});

// favorites page
app.post('/favorites', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    // show profile if logged-in user
    if (user) {
      res.sendFile(__dirname + '/public/views/favorites.html');
    // redirect if no user logged in
    } else {
      res.redirect('/');
    }
  });
});

// AUTH ROUTES (SIGN UP, LOG IN, LOG OUT)

// create new user with secure password
app.post('/users', function (req, res) {
  var newUser = req.body.user;
  User.createSecure(newUser, function (err, user) {
    // log in user immediately when created
    req.login(user);
    res.redirect('/profile');
  });
});


// authenticate user and set session
app.post('/login', function (req, res) {
  var userData = req.body.user;
  User.authenticate(userData.username, userData.password, function (err, user) {
    req.login(user);
    res.redirect('/profile');
  });
});

// log out user (destroy session)
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// API ROUTES

// show current user
app.get('/api/users/current', function (req, res) {
  // check for current (logged-in) user
  req.currentUser(function (err, user) {
    res.json(user);
  });
});

// create new favorite for current user
app.post('/api/users/current/favorites', function (req, res) {
  // create new log with form data (`req.body`)
  var newFavorite = new Favorite({
    image: req.body.image
    // text: req.body.text
  });

  // save new favorite
  newFavorite.save();

  //find current user
  req.currentUser(function (err, user) {
    // embed new favorite in user's favorites
    user.favorites.push(newFavorite);
    // save user (and new favorite)
    user.save();
    // respond with new favorite
    res.json(newFavorite);
  });
});

// show all logs
app.get('/api/favorites', function (req, res) {
  Favorite.find(function (err, favorites) {
    res.json(favorites);
  });
});

// create new favorite
app.post('/api/favorites', function (req, res) {
  // create new log with form data (`req.body`)
  var newFavorite = new Favorite({
    image: req.body.image,
    text: req.body.text
  });

  //save new favorite
  newFavorite.save(function (err, savedFavorite) {
    res.json(savedFavorite);
  });
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('server started on localhost:3000');
});