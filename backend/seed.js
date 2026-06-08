const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/product.js');

const products = [
  {
    name: 'Diamond Necklace',
    description: 'Elegant 18k gold diamond necklace perfect for special occasions',
    price: 299,
    category: 'Jewelry',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop'
  },
  {
    name: 'Gold Earrings',
    description: 'Beautiful 22k gold drop earrings handcrafted by artisans',
    price: 149,
    category: 'Jewelry',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop'
  },
  {
    name: 'Pearl Bracelet',
    description: 'Classic freshwater pearl bracelet with gold clasp',
    price: 199,
    category: 'Jewelry',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop'
  },
  {
    name: 'Silver Ring',
    description: 'Sterling silver ring with elegant stone setting',
    price: 79,
    category: 'Jewelry',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop'
  },
  {
    name: 'Ruby Pendant',
    description: 'Stunning ruby pendant set in 18k white gold',
    price: 349,
    category: 'Jewelry',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop'
  },
  {
    name: 'Gold Bangles Set',
    description: 'Set of 6 traditional gold bangles perfect for celebrations',
    price: 259,
    category: 'Jewelry',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=300&fit=crop'
  },
  {
    name: 'Floral Summer Dress',
    description: 'Lightweight floral summer dress perfect for any occasion',
    price: 89,
    category: 'Dresses',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop'
  },
  {
    name: 'Evening Gown',
    description: 'Stunning floor-length evening gown for formal events',
    price: 179,
    category: 'Dresses',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop'
  },
  {
    name: 'Casual Boho Dress',
    description: 'Trendy bohemian style dress for casual outings',
    price: 69,
    category: 'Dresses',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=300&fit=crop'
  },
  {
    name: 'Red Party Dress',
    description: 'Gorgeous red midi dress perfect for parties and celebrations',
    price: 129,
    category: 'Dresses',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=300&fit=crop'
  },
  {
    name: 'Silk Maxi Dress',
    description: 'Elegant silk maxi dress for a sophisticated look',
    price: 159,
    category: 'Dresses',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=400&h=300&fit=crop'
  },
  {
    name: 'Emerald Necklace',
    description: 'Breathtaking emerald and diamond necklace in gold setting',
    price: 499,
    category: 'Jewelry',
    stock: 4,
    image: 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=400&h=300&fit=crop'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected ✅');

    await Product.deleteMany({ name: { $ne: 'iphone 16' } });
    console.log('Old products cleared ✅');

    await Product.insertMany(products);
    console.log('12 products added successfully ✅');

    mongoose.connection.close();
    console.log('Done! 🎉');
  } catch (error) {
    console.log('Error:', error);
  }
};

seedDB();