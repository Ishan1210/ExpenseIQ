import api from './client';

export const getInsights = () => api.get('/ai/insights').then((res) => res.data);
