import api from './api';

export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  // User info UI ke liye rakho, token cookies handle karegi
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

export const register = async (data) => {
  return await api.post('/auth/register', data);
};

export const getMe = async () => {
  return await api.get('/auth/me');
};