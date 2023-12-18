const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));



// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/doc",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



// Import the Department model
const Department = require('./models/departments');
const Category = require('./models/categories');
const Approver = require('./models/approvers');
const File = require('./models/files');
const ApprovedFile = require('./models/ApprovedFile');
// const User = require('./models/users'); // Assuming you have a User model


const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  additionalData: Object, // Allow dynamic fields
});

const User = mongoose.model('User', UserSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

// User registration endpoint
app.post('/users', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, 'your-secret-key', {
      expiresIn: '1h',
    });

    // Send the token and user data in the response
    res.status(201).json({ token, user: savedUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, 'your-secret-key', {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile route
app.route('/profile')
  .get(verifyToken, async (req, res) => {
    const { userId, role } = req.user;

    try {
      // Fetch user profile data from the database based on userId
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userProfile = {
        userId,
        username: user.username,
        role,
        additionalData: user.additionalData || {}, // Include dynamic fields
      };

      res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })
  .put(verifyToken, async (req, res) => {
    const { userId } = req.user;

    try {
      // Fetch the user from the database
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update existing fields
      user.username = req.body.username || user.username;
      user.role = req.body.role || user.role;

      // Add or update dynamic fields in additionalData
      user.additionalData = {
        ...user.additionalData,
        ...req.body.additionalData,
      };

      // Save the updated user
      const updatedUser = await user.save();

      res.status(200).json({
        message: 'User profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  
  app.get('/users', verifyToken, async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await User.find({}, 'username role additionalData');
  
      const formattedUsers = users.map((user) => ({
        id: user._id,  // Corrected property name
        name: user.additionalData?.name || '',
        role: user.role,
      }));
  
      res.status(200).json(formattedUsers);
    } catch (error) {
      console.error('Error fetching user list:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  






// Create a route to add a department
app.post('/department', async (req, res) => {
    const { name } = req.body;
  
    try {
      // Save department data to the database
      const department = new Department({ name });
      await department.save();
  
      console.log('Department added to MongoDB:', department);
      res.status(201).json({ message: 'Department added successfully' });
    } catch (error) {
      console.error('Error adding department:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // Create a route to fetch all departments
app.get('/departments', async (req, res) => {
    try {
      const departments = await Department.find();
      res.status(200).json(departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  // Create a route to add a category
app.post('/categories', async (req, res) => {
  const { name } = req.body;

  try {
    // Save category data to the database
    const category = new Category({ name });
    await category.save();

    console.log('Category added to MongoDB:', category);
    res.status(201).json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a route to fetch all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find(); // Assuming you have a Category model

    if (categories) {
      res.status(200).json(categories);
    } else {
      res.status(404).json({ error: 'No categories found' });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create a route to add a new approver
app.post('/approvers', async (req, res) => {
  const { name, department, designation, username, password, profilePic } = req.body;

  try {
    // Create a new Approver model
    const approver = new Approver({
      name,
      department,
      designation,
      username,
      password,
      profilePic, // Store the profile picture in the database
    });

    await approver.save();

    console.log('Approver added to MongoDB:', approver);
    res.status(201).json({ message: 'Approver added successfully' });
  } catch (error) {
    console.error('Error adding approver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create a route to fetch all existing approvers
app.get('/approvers', async (req, res) => {
  try {
    const approvers = await Approver.find();
    res.status(200).json(approvers);
  } catch (error) {
    console.error('Error fetching approvers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Add a route to handle document uploads
const storage = multer.memoryStorage(); // Use memory storage to store the file in memory
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  const { senderName, documentType, approver } = req.body;

  try {
    // Fetch the selected approver's information
    const selectedApprover = await User.findOne({ _id: approver }, 'additionalData');

    if (!selectedApprover) {
      return res.status(404).json({ error: 'Selected approver not found' });
    }

    const additionalData = selectedApprover.additionalData || {};

    const file = new File({
      name: req.file.originalname,
      data: req.file.buffer,
      status: 'Pending',
      senderName,
      documentType,
      destination: additionalData.name,
      approver: approver, // Include approver's id in the file
    });

    await file.save();

    console.log('File metadata saved to MongoDB:', file);
    res.status(201).json({ message: 'File metadata saved' });
  } catch (error) {
    console.error('Error uploading file:', error);

    // Log the error details
    console.error(error.stack);

    // Return a 500 Internal Server Error response
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/files/pending', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    // Fetch pending documents for the logged-in user where the user's ID matches the approver field
    const files = await File.find({ approver: userId, status: 'Pending' });

    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching pending files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// Create a route to fetch all files
app.get('/files', async (req, res) => {
  try {
    const files = await File.find(); 

    res.status(200).json(files);
    
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Send the file data as a response
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${file.name}"`);
    res.send(file.data);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// API endpoint for deleting a document
app.delete('/files/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    // Delete the document with the specified ID from the database
    const deletedFile = await File.findByIdAndDelete(fileId);

    if (!deletedFile) {
      return res.status(404).json({ error: 'Document not found or already deleted' });
    }

    res.json({ message: 'Document deleted', file: deletedFile });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// API endpoint for approving a document
app.post('/approve/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    // Update the status of the document with the specified ID to "Approved" in the database
    const updatedFile = await File.findByIdAndUpdate(fileId, { status: 'Approved' }, { new: true });

    if (!updatedFile) {
      return res.status(404).json({ error: 'Document not found or already approved' });
    }

    res.json({ message: 'Document approved', file: updatedFile });
  } catch (error) {
    console.error('Error approving document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for rejecting a document
app.post('/reject/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    // Update the status of the document with the specified ID to "Rejected" in the database
    const updatedFile = await File.findByIdAndUpdate(fileId, { status: 'Rejected' }, { new: true });

    if (!updatedFile) {
      return res.status(404).json({ error: 'Document not found or already rejected' });
    }

    res.json({ message: 'Document rejected', file: updatedFile });
  } catch (error) {
    console.error('Error rejecting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create a route to fetch approved files
// Create a route to fetch approved files
app.get('/approved-files', async (req, res) => {
  try {
    // Fetch approved files with sender name
    const approvedFiles = await File.find({ status: 'Approved' }, 'name senderName');

    res.status(200).json(approvedFiles);
  } catch (error) {
    console.error('Error fetching approved files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
;






  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
