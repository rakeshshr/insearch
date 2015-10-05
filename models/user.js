// require mongoose and other modules
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10);
    Favorite = require('./favorites');

// define user schema
var UserSchema = new Schema({
  username: String,
  passwordDigest: String,
  favorites: [Favorite.schema]
});

// create a new user with secure (hashed) password
UserSchema.statics.createSecure = function (userData, callback) {
  // `this` references our schema
  // store it in variable `that` because `this` changes context in nested callbacks
  var that = this;

  // hash password user enters at sign up
  bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(userData.password, salt, function (err, hash) {
      console.log(hash);

      // create the new user (save to db) with hashed password
      that.create({
        username: userData.username,
        passwordDigest: hash
      }, callback);
    });
  });
};

// authenticate user (when user logs in)
UserSchema.statics.authenticate = function (username, password, callback) {
  // find user by email entered at log in
  this.findOne({username: username}, function (err, user) {
    console.log(user);

    // throw error if can't find user
    if (user === null) {
      throw new Error('Can\'t find user with username ' + username);

    // if found user, check if password is correct
    } else if (user.checkPassword(password)) {
      callback(null, user);
    }
  });
};

// compare password user enters with hashed password (`passwordDigest`)
UserSchema.methods.checkPassword = function (password) {
  // run hashing algorithm (with salt) on password user enters in order to compare with `passwordDigest`
  return bcrypt.compareSync(password, this.passwordDigest);
};

// create and export User model
var User = mongoose.model('User', UserSchema);
module.exports = User;