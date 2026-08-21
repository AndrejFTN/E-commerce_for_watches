import api from './axios'

export const addFavorite = (watchID) => api.post(`/favorite/addFavorite/${watchID}`)
export const removeFavorite = (watchID) => api.delete(`/favorite/removeFavorite/${watchID}`)
export const getMyFavorites = (params) => api.get('/favorite/getMyFavorites', { params })