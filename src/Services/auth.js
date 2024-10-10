import axios from 'axios';

const API_URL = 'http://localhost:3000';

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  if (response.headers.authorization) {
    const token = response.headers.authorization.split(' ')[1];
    localStorage.setItem('token', token);
    setAuthHeader(token);
  }
  return response.data;
};

const signup = async (username, password) => {
  const response = await axios.post(`${API_URL}/users`, { username, password });
  if (response.headers.authorization) {
    const token = response.headers.authorization.split(' ')[1];
    localStorage.setItem('token', token);
    setAuthHeader(token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  setAuthHeader(null);
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthHeader(token);
    return true;
  }
  return false;
};

export { login, signup, logout, getCurrentUser };