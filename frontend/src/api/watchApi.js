import api from './axios'

// ---------- javno  ----------
export const getWatches = (params) =>
    api.get('/watch/filterWatches', { params })

export const getOneWatch = (watchID) =>
    api.get(`/watch/getOneWatch/${watchID}`)

export const getFilterOptions = () =>
    api.get('/watch/filterOptions')

export const imageUrl = (imageID) =>
    `/api/watch/image/${imageID}`

// ---------- admin ----------
export const addWatch = (data) =>
    api.post('/watch/addWatch', data)

export const addWatchImage = (watchID, file) => {
    const form = new FormData()
    form.append('image', file)
    return api.post(`/watch/${watchID}/addImage`, form)
}

export const setPrimaryImage = (watchID, imageID) =>
    api.put(`/watch/${watchID}/setPrimaryImage/${imageID}`)

export const deleteWatchImage = (watchID, imageID) =>
    api.delete(`/watch/${watchID}/deleteImage/${imageID}`)

export const deleteWatch = (watchID) =>
    api.delete(`/watch/deleteWatch/${watchID}`)

export const setWatchStatus = (watchID, status) =>
    api.put(`/watch/statusWatch/${watchID}`, null, { params: { status } })

export const addAmount = (data) =>
    api.put('/watch/addAmount', data)