import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'database-1.cul6uu88mb1i.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

export default pool;