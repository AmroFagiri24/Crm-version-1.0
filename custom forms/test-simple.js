import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'database-1.cul6uu88mb1i.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'database-1',
  user: 'postgres',
  password: 'K93504241Aa',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000
});

async function testConnection() {
  try {
    console.log('Attempting connection...');
    await client.connect();
    console.log('✓ Connected successfully');
    await client.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();