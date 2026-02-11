import api from './api';

export const getMyInventory = () => api.get('/inventory/my');

export const addInventory = (data) => api.post('/inventory/add', data);

export const updateInventory = (id, data) => api.put(`/inventory/update/${id}`, data);

export const deleteInventory = (id) => api.delete(`/inventory/delete/${id}`);