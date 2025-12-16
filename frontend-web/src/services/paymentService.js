import api from './api'

export const paymentService = {
  getPayment: (orderId) => api.get(`/orders/${orderId}/payment`),
  createPayment: (orderId, data) => api.post(`/orders/${orderId}/payment`, data),
  // Update payment berdasarkan orderId, sesuai route backend: PUT /orders/{id}/payment
  updatePayment: (orderId, data) => api.put(`/orders/${orderId}/payment`, data),
}
