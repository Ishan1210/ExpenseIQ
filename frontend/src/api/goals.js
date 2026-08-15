import api from './client';

export const getGoals = () => api.get('/goals').then((res) => res.data.goals);

export const createGoal = (data) =>
  api.post('/goals', data).then((res) => res.data.goal);

export const updateGoal = (id, data) =>
  api.put(`/goals/${id}`, data).then((res) => res.data.goal);

export const deleteGoal = (id) =>
  api.delete(`/goals/${id}`).then((res) => res.data);
