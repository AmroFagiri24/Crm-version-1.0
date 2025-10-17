// Test script to verify data persistence
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/?retryWrites=true&w=majority';

async function testDataPersistence() {
  const client = new MongoClient(uri);

  try {
    console.log('🔄 Testing data persistence...');
    
    await client.connect();
    console.log('✅ MongoDB connection successful');
    
    const db = client.db('crm_database');
    
    // Test user data collection
    const usersCollection = db.collection('users');
    
    // Insert test user data
    const testUser = {
      username: 'test_user_' + Date.now(),
      name: 'Test User',
      role: 'cashier',
      createdAt: new Date().toISOString(),
      testData: true
    };
    
    const insertResult = await usersCollection.insertOne(testUser);
    console.log('✅ Test user inserted:', insertResult.insertedId);
    
    // Retrieve the test user
    const retrievedUser = await usersCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Test user retrieved:', retrievedUser.username);
    
    // Test user-specific data collection
    const userDataCollection = db.collection('userData');
    
    const testUserData = {
      _id: `${testUser.username}_orders`,
      data: [
        {
          id: Date.now(),
          table: 'Table 1',
          status: 'New',
          items: [{ name: 'Test Item', quantity: 1, price: 10 }],
          date: new Date().toISOString()
        }
      ]
    };
    
    await userDataCollection.insertOne(testUserData);
    console.log('✅ Test user data inserted');
    
    // Retrieve user data
    const retrievedUserData = await userDataCollection.findOne({ _id: `${testUser.username}_orders` });
    console.log('✅ Test user data retrieved:', retrievedUserData.data.length, 'orders');
    
    // Clean up test data
    await usersCollection.deleteOne({ _id: insertResult.insertedId });
    await userDataCollection.deleteOne({ _id: `${testUser.username}_orders` });
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 Data persistence test completed successfully!');
    console.log('📝 Your data should now persist properly when logging in/out');
    
  } catch (error) {
    console.error('❌ Data persistence test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify MongoDB Atlas credentials');
    console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
  } finally {
    await client.close();
  }
}

testDataPersistence();