import api from './axios'

export const sendRequest = (data) =>                   // { name, email, subject, text }
    api.post('/request/sendRequest', data)