//first things first, create the app
var express = require('express');
var app = express();

//setup handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main'
});

//setup your app stuff and middlewares 
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3001);
app.use(express.static(__dirname + '/public'));
app.use(require('morgan')('dev'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( {'extended':'true'} ));

//initialize the DB and DB Connection
var dbURI = 'mongodb://localhost/dominion';
var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: {
            keepalive: 1
        }
    }
};

mongoose.connect(dbURI, opts);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

//create the Player Model.
var Player = require('./models/player.js');

//make the library available
var fortune = require('./lib/fortune.js');


app.get('/api/players', function (req, res) {
    Player.find(function (err, Players) {
        if (err) {
            console.log(err);
            res.json(300, err);
        }

        res.status(200).json(Players);
    });
});

app.post('/api/player/', function (req, res) {
    console.log(req.body);

    var newRecord = new Player({
        name: req.body.name,
        ranking: req.body.ranking
    });

    newRecord.save(function (err, a) {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            res.status(200).json({
                id: a._id
            });
        }
    });

});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about', {
        fortune: fortune.getFortune()
    });
});

app.get('/headers', function (req, res) {
    res.set('Content-Type', 'text/plain');
    var s = 'Request Headers:' + '\n';
    for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

//custom 404 page
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});

//custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + ';press Crl-C to terminate.');
});