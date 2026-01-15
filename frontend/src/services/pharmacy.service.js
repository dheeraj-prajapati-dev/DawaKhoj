import axios from 'axios';
import { authHeader } from '../utils/authHeader';

const API = 'http://localhost:5000/api/pharmacy';

export const getMyPharmacyProfile = () => {
  return axios.get(`${API}/me`, {
    headers: authHeader()
  });
};
