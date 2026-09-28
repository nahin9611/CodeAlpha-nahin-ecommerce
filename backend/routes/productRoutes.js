const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth'); // Import our guards

// 1. GET ALL PRODUCTS (Public - Includes Search)
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword 
      ? { name: { $regex: req.query.keyword, $options: 'i' } } 
      : {};
      
    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products' });
  }
});

// 2. GET SINGLE PRODUCT (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product' });
  }
});

// 3. DELETE PRODUCT (Private/Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting product' });
  }
});

// 4. CREATE PRODUCT (Private/Admin Only) - Creates a sample template
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample Name',
      price: 0,
      user: req.user._id,
      imageUrl: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sample Category',
      countInStock: 0,
      description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating product' });
  }
});

// 5. UPDATE PRODUCT (Private/Admin Only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, imageUrl, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating product' });
  }
});

module.exports = router;