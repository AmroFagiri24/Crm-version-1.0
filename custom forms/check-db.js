import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://username:password@docdb-cluster.cluster-xyz.us-east-1.docdb.amazonaws.com:27017/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false';

async function checkDatabase() {
  const client = new MongoClient(uri, {
    ssl: true,
    sslValidate: false
  });

  try {
    console.log('Testing DocumentDB connection...');
    
    await client.connect();
    console.log('✓ DocumentDB connection successful');
    
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
    
    console.log('\n✓ DocumentDB check completed');
    
  } catch (error) {
    console.error('❌ DocumentDB error:', error.message);
  } finally {
    await client.close();
  }
}

checkDatabase();