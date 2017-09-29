// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');

// // Connection URL
// var url = 'mongodb://signup_storage:lk09mnhg@ds147044.mlab.com:47044/doradotest';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   db.close();
// });
var express = require('express');
var path = require('path');
var app = express();
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser');

var db;

MongoClient.connect('mongodb://signup_storage:lk09mnhg@ds147044.mlab.com:47044/doradotest',function(err,database){
	if(err) return console.log(err);
	db=database
	app.listen(5000, function(){
  	console.log('Server listening on port 5000');
});
})

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/login.html'));
});
app.get('/register', function(req, res){
  res.sendFile(path.join(__dirname, 'views/register.html'));
});
app.get('/users', function(req, res){
  res.sendFile(path.join(__dirname, 'views/users_page.html'));
});

app.post('/signup_storage',function(req, res){
	db.collection('todo').save(req.body, function(err,results){
		if(err)return console.log(err);

		console.log('saved to DB');
		re.redirect('/');
	})
})
