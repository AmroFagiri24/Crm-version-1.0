import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/?retryWrites=true&w=majority';

async function checkDatabase() {
  const client = new MongoClient(uri);

  try {
    console.log('Testing MongoDB Atlas connection...');
    
    await client.connect();
    console.log('✓ MongoDB Atlas connection successful');
    
    const db = client.db('crm_database');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections in database:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check data counts
    console.log('\n📊 Data counts:');
    for (const collection of collections) {
      try {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`  ${collection.name}: ${count} documents`);
      } catch (error) {
        console.log(`  ${collection.name}: Error counting documents`);
      }
    }
    
    console.log('\n✓ MongoDB Atlas check completed');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas error:', error.message);
  } finally {
    await client.close();
  }
}

checkDatabase();