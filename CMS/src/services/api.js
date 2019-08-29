import axios from 'axios';
import { TOKEN } from '../utils/constants';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`
  },
});


export const fetchCategories = async (page = 1, pageSize = 10) => {
  const response = await api.get('/categories');
  const { data } = response.data;
  return data;
};

export const createCategory = async (name) => {
  const response = await api.post('/categories', { name });
  const { data } = response.data;
  return data;
}

export const deleteCategory = async id => {
  const response = await api.delete(`/categories/${id}`);
  const { data } = response.data;
  return data;
}

export const updateCategory = async (id, name) => {
  const response = await api.put(`/categories/${id}`, { name });
  const { data } = response.data;
  return data;
}

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
