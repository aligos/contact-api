"use strict"
const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/test';
mongoose.Promise = Promise;
mongoose.connect(URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db connected');
});

const userSchema = mongoose.Schema({
  username: String,
  title: String,
  name: {
    first: String,
    last: String
  },
  location: {
    street: String,
    city: String,
    state: String,
    zip: Number
  },
  email: String,
  phone: String,
  company: String
});

userSchema.virtual('name.full').get(function () {
  return _.startCase(this.name.first + ' ' + this.name.last);
});

userSchema.virtual('name.full').set(function (value) {
  var bits = value.split(' ');
  this.name.first = bits[0];
  this.name.last = bits[1];
});

exports.User = mongoose.model('User', userSchema);
