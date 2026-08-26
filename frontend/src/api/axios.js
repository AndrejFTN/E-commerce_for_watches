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

api.interceptors.response.use(                          // presreće svaki odgovor
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && localStorage.getItem('token')) {
            localStorage.removeItem('token')            // token istekao ili poništen promenom lozinke
            localStorage.removeItem('username')
            window.location.href = '/login'
        }
        return Promise.reject(err)                      // greška ide dalje, da je komponenta vidi
    }
)

export default api