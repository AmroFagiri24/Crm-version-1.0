import pool from './db.js';

async function testConnection() {
  try {
    console.log('Testing AWS RDS connection...');
    const client = await pool.connect();
    console.log('✅ Connected to AWS RDS successfully!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database query successful:', result.rows[0]);
    
    client.release();
    console.log('✅ Connection test completed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();