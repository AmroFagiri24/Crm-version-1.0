import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI;

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  console.log('URI:', uri);
  
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get database
    const db = client.db('crm_database');
    
    // Test by inserting a sample document
    const testCollection = db.collection('test_connection');
    const testDoc = {
      message: 'Hello from CRM System!',
      timestamp: new Date(),
      user: 'test_user'
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted with ID:', result.insertedId);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    console.log('\n🎉 MongoDB is ready! Your data will now be saved to MongoDB and visible in MongoDB Compass.');
    console.log('📍 Database: crm_database');
    console.log('🔗 Connection String for Compass: mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/crm_database');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas cluster is running');
    console.log('3. Check if IP address is whitelisted in MongoDB Atlas');
    console.log('4. Verify username and password are correct');
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Connection closed');
    }
  }
}

testConnection();