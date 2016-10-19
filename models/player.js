var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
    name: String,
    ranking: Number
});

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;