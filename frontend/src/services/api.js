import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const getBooks = async (search = '') => {
    const response = await api.get(`/books?search=${search}`);
    return response.data;
};

export const createBook = async (book) => {
    const response = await api.post('/books/', book);
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
};

export const getMembers = async (search = '') => {
    const response = await api.get(`/members?search=${search}`);
    return response.data;
};

export const createMember = async (member) => {
    const response = await api.post('/members/', member);
    return response.data;
};

export const deleteMember = async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
};

export const issueBook = async (transaction) => {
    const response = await api.post('/transactions/issue', transaction);
    return response.data;
};

export const returnBook = async (transactionId) => {
    const response = await api.post(`/transactions/return/${transactionId}`);
    return response.data;
};

export const getTransactions = async () => {
    const response = await api.get('/transactions/');
    return response.data;
};

export const getStats = async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
};
