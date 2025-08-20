import React, { useLayoutEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const verify = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify`, {
        withCredentials: true,
      });

      // Save to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('expiry', Date.now() + 86400000); // 24 hrs in ms

      // Set state
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error('Verification failed: ', err.response?.data || err.message);
    }
  };

  useLayoutEffect(() => {
    const checkAuth = async () => {
      let storedToken = localStorage.getItem('token');
      let storedUser = localStorage.getItem('user');
      const expiry = localStorage.getItem('expiry');

      // Clear data if expired
      if (!expiry || (expiry && Date.now() > parseInt(expiry))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiry');
        storedToken = null;
        storedUser = null;
      }

      // Try verifying via cookie if token isn't in localStorage
      if (!storedToken && protectedRoute) {
        await verify();
        storedToken = localStorage.getItem('token');
        storedUser = localStorage.getItem('user');
      }

      if (protectedRoute && !storedToken) {
        navigate('/login', { replace: true });
      } else if (!protectedRoute && storedToken && location.pathname !== '/') {
        navigate('/', { replace: true });
      } else {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setChecking(false);
      }
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
    checkAuth();
  }, [navigate, protectedRoute, location.pathname]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#040404] text-white">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0f10] text-[#f5f7fa] font-sans">
      <Navbar user={user} />
      {children}
      <Footer />
    </div>
  );
}

export default CheckAuth;
