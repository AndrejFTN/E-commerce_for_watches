import api from './axios'
// SVE ovo je samo za ulogovane
export const getCart = () => api.get('/cart/getShoppingCart')   // gost koristi localStorage, ne ovo
export const addItemToCart = (item) => api.post('/cart/addItemToCart', item)
export const deleteItemFromCart = (itemID) => api.delete(`/cart/deleteItemFromCart/${itemID}`)
export const emptyCart = () => api.post('/cart/emptyCart')