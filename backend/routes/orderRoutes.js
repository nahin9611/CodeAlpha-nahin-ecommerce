const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth'); // Added admin guard

// 1. POST: Create a new order (Protected Customer Route)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems,
        totalPrice
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error processing order' });
  }
});

// 2. GET: Fetch logged-in user's orders (Protected Customer Route)
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching orders' });
  }
});

// 3. GET: Fetch ALL orders in the system (Admin Only)
router.get('/', protect, admin, async (req, res) => {
  try {
    // .populate() pulls the user's ID and Name from the User database collection
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching all orders' });
  }
});

module.exports = router;