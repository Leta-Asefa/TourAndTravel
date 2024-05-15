const express = require('express');
const multer  = require('multer');
const path = require('path');

const app = express();

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/') // specify the directory where you want to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

// Initialize multer upload
const upload = multer({ storage: storage });

// POST route to handle file upload
app.post('/upload', upload.single('image'), function (req, res) {
  // req.file contains information about the uploaded file
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});