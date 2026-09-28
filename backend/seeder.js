const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const products = require('./data/products');

// Load environment variables so we can connect to the database
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch((err) => console.log('Database connection error:', err));

const importData = async () => {
  try {
    // Clear out any existing products so we don't create duplicates
    await Product.deleteMany();

    // Insert the sample products into the database
    await Product.insertMany(products);

    console.log('Dummy Products Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

// Run the function
importData();