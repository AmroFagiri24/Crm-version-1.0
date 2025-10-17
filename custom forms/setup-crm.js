import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://amrofagiri24_db_user:MdrB73OPBKyM2urc@cluster0.s8me4tw.mongodb.net/?retryWrites=true&w=majority';

async function setupCRM() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB Atlas');
    
    const db = client.db('crm_database');
    
    // Create customers collection
    await db.createCollection('customers');
    await db.collection('customers').insertOne({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Example Corp',
      status: 'active',
      createdAt: new Date()
    });
    
    // Create leads collection
    await db.createCollection('leads');
    await db.collection('leads').insertOne({
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      source: 'website',
      status: 'new',
      createdAt: new Date()
    });
    
    // Create contacts collection
    await db.createCollection('contacts');
    await db.collection('contacts').insertOne({
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@example.com',
      phone: '+1122334455',
      position: 'Manager',
      createdAt: new Date()
    });
    
    // Create deals collection
    await db.createCollection('deals');
    await db.collection('deals').insertOne({
      title: 'Software License Deal',
      value: 5000,
      stage: 'proposal',
      customerId: 'sample_customer_id',
      createdAt: new Date()
    });
    
    console.log('✓ CRM collections created successfully');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Created collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

setupCRM();