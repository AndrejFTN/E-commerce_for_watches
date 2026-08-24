import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    paramsSerializer: { indexes: null },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')   // token koji ćemo upisati pri loginu
    if (token) {                                  // ako korisnik nije ulogovan, tokena nema
        config.headers.Authorization = `Bearer ${token}`
    }
    return config                                 // vrati izmenjen zahtev da se pošalje dalje
})

export default api