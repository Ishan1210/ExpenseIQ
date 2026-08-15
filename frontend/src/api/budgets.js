import api from './client';

export const getBudgets = () => api.get('/budgets').then((res) => res.data.budgets);

export const createBudget = (data) =>
  api.post('/budgets', data).then((res) => res.data.budget);

export const deleteBudget = (id) =>
  api.delete(`/budgets/${id}`).then((res) => res.data);
