import { API } from '../context/AuthContext'; // 🔥 Naya API instance import kiya

// Note: Ab 'axios' aur 'authHeader' ki zarurat nahi hai 
// Kyunki humara API instance automatically cookies aur baseURL handle karta hai.

export const getAllPharmacies = async () => {
  // Backend route: /admin/pharmacies
  return await API.get('/admin/pharmacies');
};

export const approvePharmacy = async (id) => {
  // Backend route update: /admin/pharmacy/approve/:id
  // dhyan dein ki aapke backend routes me path kya hai
  return await API.put(`/admin/pharmacy/approve/${id}`);
};

export const deletePharmacy = async (id) => {
  // Backend route: /admin/pharmacy/:id
  return await API.delete(`/admin/pharmacy/${id}`);
};