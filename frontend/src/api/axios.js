import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dawakhoj.onrender.com/api',
  withCredentials: true, // 🔥 Sabse zaruri: Iske bina cookies transfer nahi hongi
});

export default API;