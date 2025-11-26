// Local file-based authentication service
// Simulates file storage using localStorage

interface UserCredentials {
  id: number;
  name: string;
  email: string;
  password: string; // In production, this should be hashed
  role: string;
  createdAt: string;
}

const USERS_FILE_KEY = 'flirt_users_file';
const CURRENT_USER_KEY = 'flirt_current_user';
const AUTH_TOKEN_KEY = 'flirt_token';

class LocalAuthService {
  // Initialize with default admin user if file doesn't exist
  private initializeUsersFile(): void {
    const existingFile = localStorage.getItem(USERS_FILE_KEY);
    if (!existingFile) {
      const defaultUsers: UserCredentials[] = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@ccis.edu',
          password: 'password123', // In production, use bcrypt
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ];
      this.saveUsersFile(defaultUsers);
    }
  }

  // Read users from "file" (localStorage)
  private readUsersFile(): UserCredentials[] {
    this.initializeUsersFile();
    const fileContent = localStorage.getItem(USERS_FILE_KEY);
    if (!fileContent) {
      return [];
    }
    try {
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading users file:', error);
      return [];
    }
  }

  // Write users to "file" (localStorage)
  private saveUsersFile(users: UserCredentials[]): void {
    localStorage.setItem(USERS_FILE_KEY, JSON.stringify(users, null, 2));
    console.log('📁 Users file updated:', users.length, 'users saved');
  }

  // Register new user
  register(name: string, email: string, password: string): { success: boolean; user?: any; token?: string; error?: string } {
    try {
      const users = this.readUsersFile();

      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const newUser: UserCredentials = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name,
        email,
        password, // In production, hash this with bcrypt
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      // Add to users array and save
      users.push(newUser);
      this.saveUsersFile(users);

      // Generate token (simple version - in production use JWT)
      const token = this.generateToken(newUser);

      // Save current user session
      const userWithoutPassword = { ...newUser };
      delete (userWithoutPassword as any).password;
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      console.log('✅ User registered successfully:', newUser.email);
      
      return {
        success: true,
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  // Login user
  login(email: string, password: string): { success: boolean; user?: any; token?: string; error?: string } {
    try {
      const users = this.readUsersFile();

      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Check password (in production, use bcrypt.compare)
      if (user.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Generate token
      const token = this.generateToken(user);

      // Save current user session
      const userWithoutPassword = { ...user };
      delete (userWithoutPassword as any).password;
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      console.log('✅ User logged in successfully:', user.email);

      return {
        success: true,
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    console.log('✅ User logged out');
  }

  // Get current user session
  getCurrentUser(): any | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  // Generate simple token (in production, use proper JWT)
  private generateToken(user: UserCredentials): string {
    const tokenData = {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now(),
    };
    return btoa(JSON.stringify(tokenData)); // Base64 encode
  }

  // Verify token
  verifyToken(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token));
      return !!decoded.userId;
    } catch (error) {
      return false;
    }
  }

  // Get all users (for debugging - remove in production)
  getAllUsers(): UserCredentials[] {
    return this.readUsersFile();
  }

  // Export users to downloadable file
  exportUsersToFile(): void {
    const users = this.readUsersFile();
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flirt_users_backup.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log('📥 Users file exported');
  }

  // Import users from file
  async importUsersFromFile(file: File): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text();
      const users: UserCredentials[] = JSON.parse(text);
      
      // Validate structure
      if (!Array.isArray(users)) {
        return { success: false, error: 'Invalid file format' };
      }

      this.saveUsersFile(users);
      console.log('📤 Users file imported:', users.length, 'users');
      
      return { success: true };
    } catch (error) {
      console.error('Import error:', error);
      return { success: false, error: 'Failed to import file' };
    }
  }
}

export const localAuthService = new LocalAuthService();
