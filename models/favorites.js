
// require mongoose
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// define log schema
var FavoriteSchema = new Schema({
  image: String,
  text: String
});

// create and export Log model
var Favorites = mongoose.model('Favorite', FavoriteSchema);
module.exports = Favorites;