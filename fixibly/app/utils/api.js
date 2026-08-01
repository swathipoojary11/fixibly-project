const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getAuthUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const fetchApi = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    // Don't cause an infinite redirect loop if already on auth pages
    if (currentPath !== '/authentication/login' && currentPath !== '/authentication/register') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/authentication/login';
    }
    throw new Error('Access denied. Please log in again.');
  }

  const result = await response.json();
  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'API Request failed');
  }

  return result;
};
