import axios from 'axios';
import { authHeader } from '../utils/authHeader';

const API = 'https://dawakhoj.onrender.com/api/admin';

export const getAllPharmacies = () =>
  axios.get(`${API}/pharmacies`, { headers: authHeader() });

export const approvePharmacy = (id) =>
  axios.put(`${API}/pharmacy/approve/${id}`, {}, { headers: authHeader() });
