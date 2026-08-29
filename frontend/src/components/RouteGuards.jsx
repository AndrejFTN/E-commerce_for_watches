import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '../context/AuthContext'

export function RequireAuth() {
    const { isLoggedIn } = useAuth()
    const location = useLocation()

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <Outlet />
}

export function RequireAdmin() {
    const { isLoggedIn, isAdmin, checking } = useAuth()

    if (!isLoggedIn) return <Navigate to="/login" replace />

    if (checking) {
        return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>
    }

    if (!isAdmin) return <Navigate to="/" replace />

    return <Outlet />
}