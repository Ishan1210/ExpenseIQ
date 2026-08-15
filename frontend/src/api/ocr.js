import api from './client';

export const scanReceipt = (file) => {
  const formData = new FormData();
  formData.append('receipt', file);
  return api
    .post('/ocr/scan', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);
};
