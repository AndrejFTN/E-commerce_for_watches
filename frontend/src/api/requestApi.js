import api from './axios'

export const sendRequest = (data) =>
    api.post('/request/sendRequest', data)