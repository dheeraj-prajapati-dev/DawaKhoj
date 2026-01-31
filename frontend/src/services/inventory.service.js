import axios from 'axios';
import { authHeader } from '../utils/authHeader';

const API = 'https://dawakhoj.onrender.com/api/inventory';

export const getMyInventory = () =>
  axios.get(`${API}/my`, { headers: authHeader() });

export const addInventory = (data) =>
  axios.post(`${API}/add`, data, { headers: authHeader() });

export const updateInventory = (id, data) =>
  axios.put(`${API}/update/${id}`, data, { headers: authHeader() });

export const deleteInventory = (id) =>
  axios.delete(`${API}/delete/${id}`, { headers: authHeader() });
