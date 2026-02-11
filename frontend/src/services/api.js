import axios from "axios";

const api = axios.create({
  baseURL: "https://dawakhoj.onrender.com/api",
  withCredentials: true, // 🔥 Sabse zaroori: Cookies automatically jayengi
});

export default api;