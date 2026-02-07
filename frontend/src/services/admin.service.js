import axios from 'axios';
import { authHeader } from '../utils/authHeader';

const API = import.meta.env.VITE_API_URL || 'https://dawakhoj.onrender.com/api/admin';

export const getAllPharmacies = () =>
  axios.get(`${API}/pharmacies`, { headers: authHeader() });

export const approvePharmacy = (id) =>
  axios.put(`${API}/pharmacy/approve/${id}`, {}, { headers: authHeader() });

export const deletePharmacy = (id) =>
  axios.delete(`${API}/pharmacy/${id}`, { headers: authHeader() });