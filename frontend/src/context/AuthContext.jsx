import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, getMe } from '../api/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const DEFAULT_USER = {
  _id: 'default_user',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '9876543210',
  token: null,
  isDefault: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  // On mount: restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopsmart_user');
      if (stored && stored !== 'undefined' && stored !== 'null') {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
          if (parsed.wishlist) setWishlist(parsed.wishlist);
        } else {
          setUser(DEFAULT_USER);
        }
      } else {
        setUser(DEFAULT_USER);
      }
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      setUser(DEFAULT_USER);
    }
    setAuthInitialized(true);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await apiLogin({ email, password });
      setUser(data);
      setWishlist(data.wishlist || []);
      localStorage.setItem('shopsmart_user', JSON.stringify(data));
      toast.success(`🎉 Welcome back, ${data.name.split(' ')[0]}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await apiRegister({ name, email, password, phone });
      setUser(data);
      localStorage.setItem('shopsmart_user', JSON.stringify(data));
      toast.success(`🎉 Account created! Welcome, ${data.name.split(' ')[0]}!`);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(DEFAULT_USER);
    setWishlist([]);
    localStorage.setItem('shopsmart_user', JSON.stringify(DEFAULT_USER));
    toast.info('👋 Logged out successfully');
  };

  const isLoggedIn = user && !user.isDefault;

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, wishlist, setWishlist, isLoggedIn, authInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
