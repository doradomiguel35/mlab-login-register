const express = require('express');
const bodyParser= require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();


mongoose.Promise = global.Promise;
const accountSchema = new mongoose.Schema({
	name: 'string',	
	email: 'string',
	username: 'string',
	password: 'string'
});
const uri = "mongodb://signup_storage:lk09mnhg@ds147044.mlab.com:47044/doradotest";

const options = {
	useMongoClient: true,
	promiseLibrary: require('bluebird'),
};
const db = mongoose.createConnection(uri, options);
const Accounts = db.model('accounts', accountSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
	const callback = (err,result) => {
		if(err)throw err;
		res.render('login.ejs', {accounts: result});		
	};
	Accounts.find(callback);
});

app.post('/login',(req,res)=> {
	var username = req.body.username;
	var password = req.body.password;
	

	Accounts.findOne({username: username, password: password},(err,user)=>{
		if(err){
			console.log(err);
			return res.status(500);
		}
		
		if(!user){
			console.log("Invalid Username or Password");
			return res.status(404);
		}
		
		return res.redirect('/users_page');
	});
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
	console.log(req);
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
