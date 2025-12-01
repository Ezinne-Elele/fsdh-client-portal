// Using mock authentication - no backend API calls

// Mock users for demo
const MOCK_USERS = [
  {
    userId: 'CLIENT-001',
    email: 'client@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'client',
    requiresMFA: false,
  },
  {
    userId: 'CLIENT-002',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'client',
    requiresMFA: true,
  },
];

export const authService = {
  async login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Generate mock token
    const token = `mock_token_${user.userId}_${Date.now()}`;
    const userData = {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return {
      token,
      user: userData,
      requiresMFA: user.requiresMFA,
    };
  },

  async verifyMFA(userId, token) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock MFA verification - accept any 6-digit code
    if (token && token.length === 6) {
      const user = MOCK_USERS.find(u => u.userId === userId);
      if (user) {
        const authToken = `mock_token_${userId}_${Date.now()}`;
        const userData = {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return {
          token: authToken,
          user: userData,
        };
      }
    }
    throw new Error('Invalid MFA token');
  },

  async setupMFA(userId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      qrCode: 'data:image/png;base64,mock_qr_code',
      secret: 'MOCK_SECRET_KEY',
    };
  },

  async resetPassword(email) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      message: 'Password reset email sent (mock)',
    };
  },

  async changePassword(userId, oldPassword, newPassword) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = MOCK_USERS.find(u => u.userId === userId);
    if (!user || user.password !== oldPassword) {
      throw new Error('Invalid old password');
    }
    user.password = newPassword;
    return {
      message: 'Password changed successfully (mock)',
    };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },
};

