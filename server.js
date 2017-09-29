var express = require('express');
var path = require('path');
var app = express();
app.set('port', (process.env.PORT || 5000));
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
var server = app.listen(app.get('port'), function(){
  console.log('Server listening on port ',app.get('port'));
});