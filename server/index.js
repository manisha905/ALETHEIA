import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import apiRoutes from './routes/api.js';
import { seedDatabase } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ONLINE', system: 'ALETHEIA Encrypted Case Vault API' });
});

// API Routes
app.use('/api', apiRoutes);

async function startServer() {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aletheia';

  try {
    console.log('📡 Attempting MongoDB connection at:', mongoUri);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to MongoDB Instance.');
  } catch (err) {
    console.warn('⚠️ Local MongoDB Daemon not detected. Initializing embedded MongoMemoryServer engine...');
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('✅ Embedded MongoMemoryServer connected successfully at:', mongoUri);
  }

  // Seed MongoDB Collections
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 ALETHEIA MongoDB Express API Server listening on port ${PORT}`);
  });
}

startServer();
