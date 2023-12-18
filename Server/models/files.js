const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  status: { type: String, default: 'Pending' },
  senderName: String,
  documentType: String,
  destination: String,
  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
