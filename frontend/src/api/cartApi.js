import api from './axios'
// sve ovo je samo za ulogovane
export const getCart = () => api.get('/cart/getShoppingCart')   // gost koristi localStorage, ne ovo
export const addItemToCart = (item) => api.post('/cart/addItemToCart', item)
export const deleteItemFromCart = (itemID) => api.delete(`/cart/deleteItemFromCart/${itemID}`)
export const updateItemAmount = (itemID, amount) =>
    api.put(`/cart/updateItemAmount/${itemID}`, null, { params: { amount } })
export const emptyCart = () => api.post('/cart/emptyCart')