const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const categories = {
  Electronics: ['Laptop', 'Smartphone', 'Headphones', 'Smartwatch', 'Camera', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Printer'],
  Clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Shoes', 'Dress', 'Shirt', 'Sweater', 'Shorts', 'Sneakers', 'Cap'],
  Groceries: ['Rice', 'Wheat', 'Oil', 'Sugar', 'Salt', 'Milk', 'Eggs', 'Butter', 'Cheese', 'Cereal'],
  Fruits: ['Apple', 'Banana', 'Orange', 'Mango', 'Grapes', 'Strawberry', 'Pineapple', 'Watermelon', 'Papaya', 'Kiwi'],
  Furniture: ['Chair', 'Table', 'Sofa', 'Bed', 'Wardrobe', 'Bookshelf', 'Desk', 'Cabinet', 'Stool', 'Dresser'],
  Beauty: ['Shampoo', 'Conditioner', 'Lotion', 'Facewash', 'Perfume', 'Soap', 'Lipstick', 'Cream', 'Serum', 'Powder'],
  Toys: ['Puzzle', 'Doll', 'Action Figure', 'Board Game', 'Car Toy', 'Robot', 'Lego Set', 'Stuffed Animal', 'Train Set', 'Toy Gun'],
  Sports: ['Football', 'Basketball', 'Cricket Bat', 'Tennis Racket', 'Yoga Mat', 'Dumbbells', 'Helmet', 'Shoes', 'Gloves', 'Jersey'],
  Automotive: ['Car Oil', 'Tyres', 'Car Battery', 'Headlights', 'Car Cover', 'Brake Pads', 'Air Filter', 'Wiper', 'Seat Cover', 'GPS'],
  Books: ['Novel', 'Biography', 'Science', 'History', 'Fantasy', 'Comics', 'Magazine', 'Textbook', 'Dictionary', 'Cookbook'],
  Stationery: ['Notebook', 'Pen', 'Pencil', 'Marker', 'Eraser', 'Ruler', 'Stapler', 'Scissors', 'Glue', 'Highlighter'],
  Kitchen: ['Pan', 'Knife', 'Spoon', 'Plate', 'Pot', 'Mixer', 'Grinder', 'Kettle', 'Cup', 'Bottle'],
  Garden: ['Shovel', 'Rake', 'Hose', 'Seeds', 'Fertilizer', 'Gloves', 'Sprinkler', 'Planter', 'Pruner', 'Wheelbarrow'],
  Pets: ['Dog Food', 'Cat Food', 'Leash', 'Collar', 'Cage', 'Toys', 'Bed', 'Bowl', 'Vitamin', 'Carrier'],
  Jewelry: ['Ring', 'Necklace', 'Bracelet', 'Earrings', 'Watch', 'Pendant', 'Bangle', 'Brooch', 'Chain', 'Cufflinks']
};

const randomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Category.deleteMany();

    const categoryDocs = [];

    for (const name of Object.keys(categories)) {
      // Set smaller font for category image to prevent text cut-off
      const image = `https://dummyimage.com/400x200/000/fff&text=${encodeURIComponent(name)}&fontsize=30`;
      const cat = await Category.create({ name, image });
      categoryDocs.push(cat);
    }

    const products = [];

    for (const cat of categoryDocs) {
      const items = categories[cat.name];
      for (const itemName of items) {
        // 1 product per item (no duplicates)
        const name = itemName;
        const image = `https://dummyimage.com/400x200/000/fff&text=${encodeURIComponent(itemName)}&fontsize=25`;
        products.push({
          name,
          price: randomPrice(50, 200000),
          image,
          description: `High quality ${name}`,
          categoryId: cat._id
        });
      }
    }

    await Product.insertMany(products);
    console.log('Categories and products with responsive images seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
