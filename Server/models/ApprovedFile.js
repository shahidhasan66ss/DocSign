const mongoose = require('mongoose');

const approvedFileSchema = new mongoose.Schema({
    name: String,
    data: Buffer, // Store the file data
    status: String, // Status should be "Approved"
    // Add other fields relevant to approved files
  });
  
  const ApprovedFile = mongoose.model('ApprovedFile', approvedFileSchema);
  
  module.exports = ApprovedFile;
  
