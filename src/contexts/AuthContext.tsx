import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'guest' | 'user' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  isLoggedIn: boolean;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for testing
const dummyUsers: User[] = [
  { id: '1', username: 'Admin User', email: 'admin@admin.com', role: 'admin' },
  { id: '2', username: 'Regular User', email: 'user@user.com', role: 'user' },
  { id: '3', username: 'Developer123', email: 'dev@example.com', role: 'user' },
  { id: '4', username: 'TSLearner', email: 'ts@example.com', role: 'user' },
  { id: '5', username: 'CSSNewbie', email: 'css@example.com', role: 'user' },
  { id: '6', username: 'PythonDev', email: 'python@example.com', role: 'user' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to update user profile
  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Dummy login - any email/password combo works
    const foundUser = dummyUsers.find(u => u.email === email) || dummyUsers[0];
    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    return true;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Dummy registration
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role: 'user'
    };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (action: string): boolean => {
    if (!user) return action === 'view'; // Guests can only view
    
    switch (user.role) {
      case 'admin':
        return true; // Admins can do everything including moderate, delete
      case 'user':
        return ['view', 'post', 'vote', 'comment', 'edit-own'].includes(action);
      case 'guest':
      default:
        return action === 'view';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isLoggedIn: !!user,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}