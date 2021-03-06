var http = require("http")
var ws = require("nodejs-websocket")
var fs = require("fs")
var express = require('express');
var path = require('path');
var app = express();
var moment = require('moment');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// These are barred words. If you say any of these your message won't go through and the message console.logged.
var listOfStrings = ['Apples', 'Oranges', 'illegal'];

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

var server = ws.createServer(function (connection) {
	connection.nickname = null
	connection.on("text", function (str) {

		var currentTime = new Date();
		currentTime = moment(currentTime).format("HH:mm:ss");

		// Check if name or message
		if (connection.nickname === null) {
			connection.nickname = str
			broadcast("["+currentTime+"] [" + str + "] entered")
		} else {
			var doesWordContainBarred = checkIfArrayContainsString(str, listOfStrings);
			if (!doesWordContainBarred) {
				broadcast("["+currentTime+"] [" + connection.nickname + "] : " + str)
			} else {
				alertBarredWord(connection.nickname, str, currentTime);
			}
		}
	})
	connection.on("close", function () {
		broadcast(connection.nickname+" left")
	})
})
server.listen(8081)

function checkIfArrayContainsString(str, array) {
	// Check if string contains any of the barred words
	for (i = 0; i < listOfStrings.length; i++) {
		if (str.indexOf(listOfStrings[i]) > -1) {
			return true;
		}
	}
	return false;
}

function alertBarredWord(username, str, currentTime) {
	console.log("ALERT: At [" + currentTime + "] Logging [" + username + "] saying [" + str + "]");
}

function broadcast(str) {
	server.connections.forEach(function (connection) {
		console.log("Broadcasting new message");
		connection.sendText(str)
	})
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Routes
// Not needed really
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.jsonp({"Hi":"Meeting Room"});
});

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;