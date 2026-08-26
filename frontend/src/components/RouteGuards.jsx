import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
    const { isLoggedIn } = useAuth()
    const location = useLocation()

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <Outlet />                                  // pusta ugnjezdene rute dalje
}

export function RequireAdmin() {
    const { isLoggedIn, isAdmin, checking } = useAuth()

    if (!isLoggedIn) return <Navigate to="/login" replace />

    if (checking) {                                    // uloga se jos proverava — ne odlucuj prerano
        return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>
    }

    if (!isAdmin) return <Navigate to="/" replace />

    return <Outlet />
}