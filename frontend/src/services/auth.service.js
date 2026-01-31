import axios from 'axios';

const API = 'https://dawakhoj.onrender.com/api/auth';

export const login = async (data) => {
  const res = await axios.post('https://dawakhoj.onrender.com/api/auth/login', data);

// 🔥 TOKEN SAVE KARO (MOST IMPORTANT)
localStorage.setItem('token', res.data.token);
localStorage.setItem('user', JSON.stringify(res.data.user));

return res.data;

};
