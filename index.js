const express = require('express');
const app = express();
const fs = require('fs');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const userRouter = require('./username');

const {User} = require('./db');

app.engine('hbs', engines.handlebars);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/favicon.ico', (req, res) => {
  res.end();
});

app.get('/', (req, res) => {
  User.find({}, (err, users) => {
    if (err) console.error(err);
    res.render('index', {users: users});
  });
});

app.get('/adduser', (req, res) => {
  res.render('adduser');
});

app.post('/adduser', (req, res) => {
  name = req.body.name;
  location = req.body.location;
  let newUser = new User({name: name, location: location});
  newUser.save(); 
});


app.use('/:username', userRouter);

const server = app.listen(3000, () => {
  console.log('Server running at http://localhost:' + server.address().port);
});
