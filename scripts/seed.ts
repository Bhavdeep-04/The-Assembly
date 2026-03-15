import mongoose from 'mongoose';
import { products } from '../src/data/products';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  specs: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String, required: true },
});

const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected.');

    console.log(`Upserting ${products.length} products...`);
    let count = 0;
    
    for (const prod of products) {
      await ProductModel.updateOne(
        { id: prod.id },
        { $set: prod },
        { upsert: true }
      );
      count++;
    }

    console.log(`Successfully seeded ${count} products.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
