// user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  department: String,
  username: String,
  password: String,
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}, // Additional information can be an object with various fields
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
