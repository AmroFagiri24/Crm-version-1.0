import { saveUserToMongoDB, getAllUsersFromMongoDB, closeMongoDB } from './src/utils/mongoUsers.js';

async function testUserCreation() {
  try {
    console.log('Testing user creation in MongoDB...');
    
    // Create a test user
    const testUser = {
      username: 'testuser123',
      password: 'testpass',
      name: 'Test User',
      role: 'employee',
      tenantId: 'test-tenant',
      restaurantName: 'Test Restaurant',
      licenseType: 'trial',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    };
    
    // Save user to MongoDB
    await saveUserToMongoDB(testUser);
    console.log('✓ Test user created successfully');
    
    // Get all users to verify
    const allUsers = await getAllUsersFromMongoDB();
    console.log('📊 Total users in MongoDB:', allUsers.length);
    console.log('👥 Users:', allUsers.map(u => u.username));
    
    console.log('✓ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await closeMongoDB();
  }
}

testUserCreation();