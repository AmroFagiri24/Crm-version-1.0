import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/?retryWrites=true&w=majority';

async function addRestaurantUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB Atlas');
    
    const db = client.db('crm_database');
    
    // Create restaurant_users collection
    await db.createCollection('restaurant_users');
    
    // Insert sample restaurant user
    await db.collection('restaurant_users').insertOne({
      restaurantName: 'Bella Vista Restaurant',
      ownerName: 'Maria Rodriguez',
      email: 'maria@bellavista.com',
      phone: '+1555123456',
      address: '123 Main St, City, State 12345',
      cuisine: 'Italian',
      seatingCapacity: 80,
      status: 'active',
      subscriptionPlan: 'premium',
      createdAt: new Date(),
      lastLogin: new Date()
    });
    
    console.log('✓ Restaurant users collection created successfully');
    
    // Verify the collection was created
    const collections = await db.listCollections().toArray();
    const restaurantCollection = collections.find(c => c.name === 'restaurant_users');
    
    if (restaurantCollection) {
      const count = await db.collection('restaurant_users').countDocuments();
      console.log(`✓ Restaurant users collection verified: ${count} document(s)`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

addRestaurantUsers();