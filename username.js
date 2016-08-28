"use strict"
const express = require('express');
const fs = require('fs');

const {User} = require('./db');

const router = express.Router({
  mergeParams: true
});

router.use((req, res, next) => {
  console.log(req.method, 'for', req.params.username, 'at', req.path);
  next();
});

router.get('/', (req, res) => {
  var username = req.params.username;
  User.findOne({username: username}, (err, user) => {
    if (user !== null) {
      res.render('user', {
        user: user,
        address: user.location
      })
    } else {
      res.status(404).send('No user named ' + req.params.username + ' found');
    }    
  });
});

router.use((err, req, res, next) => {
  if (err) console.error(err.stack);
  res.status(500).send('Something broke!');
});

router.put('/', (req, res) => {
  var username = req.params.username;

  User.findOne({username: username}, (err, user) => {
    if (err) console.error(err);

    user.name = req.body.name;
    user.location = req.body.location;
    user.save(() => {
      res.end();
    });
  });
});

router.delete('/', (req, res) => {
  var username = req.params.username;
  User.remove({username: username}, (err) => {
    console.log(req.params.username + " removed.")
    res.redirect('/');
  });
});

module.exports = router;
