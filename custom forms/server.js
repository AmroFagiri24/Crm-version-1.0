import express from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB, getAllUsers, saveUser } from './src/utils/mongoDatabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Test MongoDB connection on startup
async function initializeApp() {
  try {
    await connectToMongoDB();
    console.log('✅ Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}

// Basic API routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    await saveUser(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 CRM Server running on port ${PORT}`);
  initializeApp();
});