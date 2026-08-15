import api from './client';

export const getIncomes = () => api.get('/income').then((res) => res.data.incomes);

export const createIncome = (data) =>
  api.post('/income', data).then((res) => res.data.income);

export const deleteIncome = (id) =>
  api.delete(`/income/${id}`).then((res) => res.data);
