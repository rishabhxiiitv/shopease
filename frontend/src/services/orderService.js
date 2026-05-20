import api from './api'

export const placeOrder = async (payload) => {
  const { data } = await api.post('/orders', payload)
  return data
}

export const getMyOrders = async (params = {}) => {
  const { data } = await api.get('/orders', { params })
  return data
}

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

export const getAllOrders = async (params = {}) => {
  const { data } = await api.get('/orders/admin/all', { params })
  return data
}

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status })
  return data
}
