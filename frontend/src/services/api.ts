import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

const username = 'admin';
const password = 'admin';
const token = btoa(`${username}:${password}`);

api.defaults.headers.common['Authorization'] = `Basic ${token}`;

export const financeService = {
    uploadStatement: async (file: File, month: number, year: number) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('month', month.toString());
        formData.append('year', year.toString());

        const response = await api.post('/statements/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getDashboard: async () => {
        const response = await api.get('/dashboard/');
        return response.data;
    },

    getTransactions: async () => {
        const response = await api.get('/transactions/');
        return response.data;
    }
};
