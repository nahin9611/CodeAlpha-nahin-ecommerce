const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// 1. REGISTER A NEW USER (Secured - Standard Customers Only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Removed the isAdmin override. The database will now default to standard user.
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. LOGIN AN EXISTING USER
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. GET USER PROFILE (Protected Route)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// 4. GET ALL USERS (Admin Only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;