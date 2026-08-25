import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginApi, register as registerApi, checkIfAdmin } from '../api/userApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    const [username, setUsername] = useState(() => localStorage.getItem('username'))
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {                                  // uloga se proverava pri svakoj promeni tokena
        if (!token) { setIsAdmin(false); return }
        checkIfAdmin()
            .then(r => setIsAdmin(r.data === true))
            .catch(() => setIsAdmin(false))
    }, [token])

    const login = async (userName, password) => {
        const res = await loginApi({ userName, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', userName)     // backend nema /me, pa pamtimo ime sami
        setToken(res.data.token)
        setUsername(userName)
        return res.data.token
    }

    const register = async (data) => {
        await registerApi(data)                        // registracija NE vraća token…
        return login(data.userName, data.password)     // …pa se odmah prijavljujemo
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setToken(null)
        setUsername(null)
        setIsAdmin(false)
    }

    return (
        <AuthContext.Provider value={{
            token, username, isAdmin,
            isLoggedIn: Boolean(token),
            login, register, logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)