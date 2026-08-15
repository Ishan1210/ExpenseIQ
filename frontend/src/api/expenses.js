import api from './client';

export const getExpenses = (params = {}) =>
  api.get('/expenses', { params }).then((res) => res.data.expenses);

export const createExpense = (data) =>
  api.post('/expenses', data).then((res) => res.data.expense);

export const updateExpense = (id, data) =>
  api.put(`/expenses/${id}`, data).then((res) => res.data.expense);

export const deleteExpense = (id) =>
  api.delete(`/expenses/${id}`).then((res) => res.data);
