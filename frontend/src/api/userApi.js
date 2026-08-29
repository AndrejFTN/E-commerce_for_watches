import api from './axios'

export const login = (data) =>
    api.post('/user/login', data)

export const register = (data) =>
    api.post('/user/register', data)

export const forgotPassword = (data) => api.post('/user/forgotPassword', data)
export const resetPasswordWithToken = (data) => api.put('/user/resetPasswordWithToken', data)
export const resetPassword = (data) => api.put('/user/resetPassword', data)
export const resendEmail = (email) =>
    api.post('/user/resendEmail', null, { params: { email } })
export const getUserId = (userName) => api.get(`/user/getUserId/${userName}`)

export const getUserInfo = (userName) => api.get(`/user/getUserInfo/${userName}`)
export const updateUser = (userID, data) => api.put(`/user/updateUser/${userID}`, data)
export const checkIfAdmin = () => api.get('/user/checkIfAdmin')
export const verifyEmail = (token) =>
    api.get('/user/verify', { params: { token } })

export const getMyInfo = () => api.get('/user/me')
export const updateMyProfile = (data) => api.put('/user/updateProfile', data)