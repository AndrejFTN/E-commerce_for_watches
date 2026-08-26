import api from './axios'

export const getDashboard = () => api.get('/admin/dashboard')

export const getUsersPage = (params) => api.get('/user/getAllPage', { params })