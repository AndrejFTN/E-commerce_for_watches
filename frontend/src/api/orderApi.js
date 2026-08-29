import api from './axios'

export const createOrder = (data) =>
    api.post('/order/createOrder', data)

export const getOrder = (orderID) => api.get(`/order/getOrder/${orderID}`)
export const getAllOrders = (params) => api.get('/order/getAllOrders', { params })
export const getOrdersByStatus = (params) => api.get('/order/getOrdersByStatus', { params })
export const cancelOrder = (orderID) => api.put(`/order/cancelOrder/${orderID}`)
export const adminGetAllOrders = (params) => api.get('/order/admin/getAllOrders', { params })
export const checkout = (orderID) =>
    api.post(`/order/checkout/${orderID}`)


export const adminGetOrder = (orderID) => api.get(`/order/admin/getOrder/${orderID}`)
export const adminGetUserOrders = (username, params) => api.get(`/order/admin/getAllOrders/${username}`, { params })
export const adminGetUserOrdersByStatus = (username, params) => api.get(`/order/admin/getOrdersByStatus/${username}`, { params })