var express = require('express');
var http = require('http');
var path = require('path');
var async = require('async');
//var request = require('request');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
console.log('ENV:'+app.get('env'));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', function(req, res) {res.send('hello!')});
app.get('/', function(req, res) {
	res.render('main');
});

app.get('/submitForm', function(req, res) {
  console.log('form submitted:' + req.query.user);
  //res.render('output');
  res.send('//www.youtube.com/embed/JhtdC86wWIk');
});

app.get('/async', function(req, res, next) {
  var userId1;
  var userId2;
  console.log('async started');
  async.series([
  	//function1 - db or service call
    function(callback) {
    	userId1 = 'result1 from first function'; //Set the userId here, so the next task can access it
      callback(null, 'one');
    },
		//function2 - another db or service call
		function(callback) {
    	userId2 = userId1 + '<br>result2 from second function';
			callback(null, 'two');
		}
    ], function(err, results) { //This function gets called after the two tasks have called their "task callbacks"
    	if (err) return next(err);
      //Here locals will be populated with 'user' and 'posts'
			console.log(results);
      res.send('<h1>'+userId2+'</h1>');
		}
	);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
