const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

let client = redis.createClient();

client.on('connect', function(){
  console.log('Connected redissssss');
});

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// methodOverride
app.use(methodOverride('_method'));


app.get('/', function(req, res, next){
  res.render('index');
});

app.post('/user/add', function(req, res, next){
  let id = req.body.id;
  let first_name = req.body.first_name;
  let phone = req.body.phone;

  client.hmset(id, [
    'first_name', first_name,
    'phone', phone
  ], function(err, reply){
    if(err){
      console.log(err);
    }
    console.log(reply);
    res.redirect('/');
  });
});


app.post('/user/search', function(req, res, next){
	console.log(req.body);
  let id = req.body.id;

  client.hgetall(id, function(err, obj){
    if(!obj){
    	console.log('!obj');
      res.render('search', {
        error: 'User does not exist'
      });
    } else {
    	// console.log('else')
      obj.id = id;
    	console.log(obj)

      res.render('detail', {
        user: obj
      });
    }
  });
});

app.get('/search', function(req, res, next){
  res.render('search',{
        error: ''
      });
});

app.delete('/user/delete/:id', function(req, res, next){
  client.del(req.params.id);
  res.redirect('/');
});

app.listen(3000, function(){
  console.log('Server started on port 3000');
});