var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstname: String,
    lastname: String,
    ranking: {type: Number, default: 2000}
});

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;