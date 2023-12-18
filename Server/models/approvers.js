const mongoose = require('mongoose');

const approverSchema = new mongoose.Schema({
  name: String,
  department: String,
  designation: String,
  username: String,
  password: String,
  profilePic: String,
});

const Approver = mongoose.model('Approver', approverSchema);

module.exports = Approver;
