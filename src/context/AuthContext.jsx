import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('flowboard_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Sync session changes to browser storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('flowboard_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('flowboard_active_user');
    }
  }, [currentUser]);

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('flowboard_users_db') || '[]');
      const normalizedEmail = email.trim().toLowerCase();

      if (users.some((u) => u.email === normalizedEmail)) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        email: normalizedEmail,
        password, // In a production environment, never store plaintext passwords
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('flowboard_users_db', JSON.stringify(users));

      // Auto login upon registration
      const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
      setCurrentUser(sessionUser);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('flowboard_users_db') || '[]');
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = users.find(
        (u) => u.email === normalizedEmail && u.password === password
      );

      if (!existingUser) {
        throw new Error('Invalid email or password combination.');
      }

      const sessionUser = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      };
      setCurrentUser(sessionUser);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};