// API utility for MongoDB backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  // User Management
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateUser(username, userData) {
    return this.request(`/users/${username}`, {
      method: 'PUT',
      body: userData,
    });
  }

  async deleteUser(username) {
    return this.request(`/users/${username}`, {
      method: 'DELETE',
    });
  }

  async authenticateUser(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  // Tenant Management
  async getTenants() {
    return this.request('/tenants');
  }

  async createTenant(tenantData) {
    return this.request('/tenants', {
      method: 'POST',
      body: tenantData,
    });
  }

  // Data Management (per user)
  async getUserData(username, dataType) {
    return this.request(`/users/${username}/data/${dataType}`);
  }

  async saveUserData(username, dataType, data) {
    return this.request(`/users/${username}/data/${dataType}`, {
      method: 'POST',
      body: { data },
    });
  }
}

export default new ApiService();