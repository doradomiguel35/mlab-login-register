// const express = require('express');
// const bodyParser= require('body-parser');
// const favicon = require('serve-favicon');
// const path = require('path');
// const app = express();
// const mongoose = require('mongoose');
// const dotenv = require('dotenv').config();
// const MongoClient = require('mongodb')

// mongoose.Promise = global.Promise;
// const schema = new mongoose.Schema({
// 	username: 'string',
// 	password: 'string',
// 	firstname: 'string',
// 	lastname: 'string',
// 	emailadd: 'string'
// });

// const url = "mongodb://signup_storage:lk09mnhg@ds147044.mlab.com:47044/doradotest";
// const options = {
// 	useMongoClient: true,	
// 	promiseLibrary: require('bluebird')
// };
// const db = mongoose.createConnection(url,options);
// const User = db.model('users', schema);

// db.on('open',function(){
// 	console.log("db connected");	
// 	User.find(function(err,result){
// 	if(err)throw err;
// 	console.log(result);
// 	});
// 	db.close();
// });

const express = require('express');
const bodyParser= require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

/*>>> setup mongo model <<<*/
mongoose.Promise = global.Promise;
const accountSchema = new mongoose.Schema({
	name: 'string',	
	email: 'string',
	username: 'string',
	password: 'string'
});
const uri = "mongodb://signup_storage:lk09mnhg@ds147044.mlab.com:47044/doradotest";
// const uri = process.env.DB_URI;
const options = {
	useMongoClient: true,
	promiseLibrary: require('bluebird'),
};
const db = mongoose.createConnection(uri, options);
const Accounts = db.model('accounts', accountSchema);

/*>>> setup template view engine <<<*/
app.set('view engine', 'ejs');

/*>>> using express middlewares <<<*/
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());

/*>>> defining routes <<<*/
app.get('/', (req,res)=>{
	const callback = (err,result) => {
		if(err)throw err;
		res.render('login.ejs', {accounts: result});		
	};
	Accounts.find(callback);
	// res.sendFile(__dirname + '/index.html');
});

app.post('/accounts', (req, res) => {
	const newAccount = {
		"name": req.body.name,
		"email": req.body.email,
		"username": req.body.username,
		"password": req.body.password
	};
	const callback = (err, data)=>{
		if(err)throw err;
		console.log('saved to database');
		res.redirect('/users_page');
	};
	Accounts.create(newAccount, callback);
});

app.get('/register',(req,res)=>	{
	res.render('register.ejs');
});

app.get('/users_page',(req,res)=>{
	const callback = (err,result) => {
		if(err)throw err;
		res.render('users_page.ejs', {accounts: result});		
	};
	Accounts.find(callback);
})

app.put('/students', (req, res) => {
	const query = {
		studentid: req.body.studentid
	};
	const update = {
		$set: {
			firstname: req.body.firstname,
			lastname: req.body.lastname
		}
	};
	const options = {
		sort: {_id: -1},
		upsert: false
	};
	const callback = (err, result) => {
		if (err) return res.send(err);
		res.send(result);
	};

	Students.updateOne(query, update, options, callback);
	// Students.findOneAndUpdate(query, update, options, callback);
});

app.delete('/students', (req, res) => {
	const query = {
		studentid: req.body.studentid
	};
	const callback = (err, result) => {
		if (err) return res.send(500, err);
		res.send({message: req.body.studentid + ' got deleted.'});
	};

	Students.deleteOne(query, callback);
});

/*>>> run server and assign port <<<*/
app.set('port',(process.env.PORT || 3000));
app.listen(app.get('port'),()=>{
	console.log('listening on ', app.get('port'));
});
