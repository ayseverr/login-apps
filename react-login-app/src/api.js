import axios from 'axios';

// all API calls are centralized here so we can easily swap out the backend, add error handling, or use interceptors in one place. keeps the rest of the app clean.

const API_BASE = 'https://jsonplaceholder.typicode.com';

export const fetchPosts = () => axios.get(`${API_BASE}/posts`).then(res => res.data);

export const fetchUsers = () => axios.get(`${API_BASE}/users`).then(res => res.data);
export const fetchPostById = (id) => axios.get(`${API_BASE}/posts/${id}`).then(res => res.data);