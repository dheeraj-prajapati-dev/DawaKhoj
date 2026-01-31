import axios from 'axios';
import { authHeader } from '../utils/authHeader';

const API = 'https://dawakhoj.onrender.com/api/pharmacy';

export const getMyPharmacyProfile = () => {
  return axios.get(`${API}/me`, {
    headers: authHeader()
  });
};
