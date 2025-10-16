import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'database-1.cul6uu88mb1i.us-east-1.rds.amazonaws.com',
  database: process.env.DB_NAME || 'database-1',
  password: process.env.DB_PASSWORD || 'K93504241Aa',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Testing PostgreSQL connection...');
    console.log('Connection details:');
    console.log('- Host:', process.env.DB_HOST || 'database-1.cul6uu88mb1i.us-east-1.rds.amazonaws.com');
    console.log('- Database:', process.env.DB_NAME || 'database-1');
    console.log('- User:', process.env.DB_USER || 'postgres');
    console.log('- Port:', process.env.DB_PORT || 5432);
    
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully!');
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query test successful:', result.rows[0].current_time);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name));
    
    client.release();
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🔍 DNS resolution failed - check host address');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Connection refused - check if database is running and port is correct');
    } else if (error.code === '28P01') {
      console.error('🔍 Authentication failed - check username/password');
    } else if (error.code === '3D000') {
      console.error('🔍 Database does not exist - check database name');
    }
  } finally {
    await pool.end();
  }
}

testConnection();