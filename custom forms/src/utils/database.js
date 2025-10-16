import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'crm_database',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// User Management
export const saveUser = async (userData) => {
  try {
    console.log('Saving user to PostgreSQL:', userData.username);
    const query = `
      INSERT INTO users (username, password, role, email, phone, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (username) 
      DO UPDATE SET password = $2, role = $3, email = $4, phone = $5
    `;
    await pool.query(query, [
      userData.username,
      userData.password,
      userData.role,
      userData.email,
      userData.phone
    ]);
    console.log('User saved successfully to PostgreSQL:', userData.username);
  } catch (error) {
    console.error('Error saving user to PostgreSQL:', error);
    throw error;
  }
};

export const getUser = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    const userData = result.rows[0] || null;
    if (userData) {
      console.log('User found in PostgreSQL:', username);
    }
    return userData;
  } catch (error) {
    console.error('Error getting user from PostgreSQL:', error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    console.log('Retrieved users from PostgreSQL:', result.rows.length);
    return result.rows;
  } catch (error) {
    console.error('Error getting all users from PostgreSQL:', error);
    return [];
  }
};

export const deleteUser = async (username) => {
  try {
    console.log('Deleting user from PostgreSQL:', username);
    const query = 'DELETE FROM users WHERE username = $1';
    await pool.query(query, [username]);
    console.log('User deleted successfully from PostgreSQL:', username);
  } catch (error) {
    console.error('Error deleting user from PostgreSQL:', error);
    throw error;
  }
};

export const checkUsernameExists = async (username) => {
  try {
    const user = await getUser(username);
    return user !== null;
  } catch (error) {
    console.error('Error checking username existence:', error);
    return false;
  }
};

// Restaurant Management
export const saveRestaurant = async (restaurantData) => {
  const query = `
    INSERT INTO restaurants (tenant_id, name, address, phone, email, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (tenant_id)
    DO UPDATE SET name = $2, address = $3, phone = $4, email = $5
  `;
  await pool.query(query, [
    restaurantData.tenantId,
    restaurantData.name,
    restaurantData.address,
    restaurantData.phone,
    restaurantData.email
  ]);
};

export const getAllRestaurants = async () => {
  const query = 'SELECT * FROM restaurants ORDER BY created_at DESC';
  const result = await pool.query(query);
  return result.rows;
};

export const deleteRestaurant = async (tenantId) => {
  const query = 'DELETE FROM restaurants WHERE tenant_id = $1';
  await pool.query(query, [tenantId]);
};

// User Data Management
export const saveUserData = async (username, dataType, data) => {
  const query = `
    INSERT INTO user_data (username, data_type, data, created_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (username, data_type)
    DO UPDATE SET data = $3, updated_at = NOW()
  `;
  await pool.query(query, [username, dataType, JSON.stringify(data)]);
};

export const getUserData = async (username, dataType) => {
  const query = 'SELECT data FROM user_data WHERE username = $1 AND data_type = $2';
  const result = await pool.query(query, [username, dataType]);
  return result.rows[0] ? JSON.parse(result.rows[0].data) : [];
};

export default pool;