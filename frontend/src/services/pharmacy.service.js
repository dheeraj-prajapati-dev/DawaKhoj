import { API } from '../context/AuthContext'; // 🔥 Naya API instance import karein

// Ab hume 'axios' ya 'authHeader' ki zaroorat nahi hai
// Kyunki API instance mein already 'withCredentials: true' aur base URL configured hai

export const getMyPharmacyProfile = async () => {
  // 🔥 Backend route '/me' hai toh bas wahi pass karein
  // Headers automatic cookies se chale jayenge
  return await API.get('/pharmacy/me'); 
};