import { useEffect, useState } from 'react'
import { Container, Box, Typography, Paper, CircularProgress, Alert } from '@mui/material'
import { getDashboard } from '../api/adminApi.js'
import AdminNav from '../components/AdminNav'
import { Link as RouterLink } from 'react-router-dom'

const eur = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n) + ' €'
const num = (n) => new Intl.NumberFormat('sr-RS').format(n)

function Stat({ label, value, hint, to }) {
    const clickable = Boolean(to)

    return (
        <Paper {...(clickable ? { component: RouterLink, to } : {})}
               sx={{ border: 1, borderColor: 'divider', p: 3, display: 'block',
                   textDecoration: 'none', color: 'inherit',
                   ...(clickable && {
                       cursor: 'pointer',
                       '&:hover': { borderColor: 'text.primary' },
                   }) }}>
            <Typography variant="overline" color="text.secondary"
                        sx={{ letterSpacing: '0.12em', fontSize: 11, display: 'block' }}>
                {label}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5 }}>{value}</Typography>
            {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
        </Paper>
    )
}

function AdminDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getDashboard()
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.message || e.message))
            .finally(() => setLoading(false))
    }, [])

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Admin panel</Typography>
            <AdminNav />

            {loading && <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {data && (
                <Box sx={{ display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                    gap: 3 }}>

                    <Stat label="Promet ovog meseca" value={eur(data.monthlyRevenue)} />
                    <Stat label="Ukupan promet" value={eur(data.totalRevenue)} />
                    <Stat label="Prosečna porudžbina" value={eur(data.averageOrderValue)} />

                    <Stat label="Korisnika ukupno" value={num(data.totalUsers)} to="/admin/users" />
                    <Stat label="Novih korisnika ovog meseca" value={num(data.newUsersThisMonth)}
                          hint="klikni za spisak, najnoviji prvo"
                          to="/admin/users" />
                    <Stat label="Neverifikovanih" value={num(data.unverifiedUsers)}
                          hint="ne mogu da poruče dok ne potvrde mejl"
                          to="/admin/users?filter=unverified" />

                    <Stat label="Satova pri kraju zaliha" value={num(data.lowStockWatches)}
                          hint="klikni za spisak, poređan po stanju"
                          to="/admin/watches?sort=stock" />
                </Box>
            )}
        </Container>
    )
}

export default AdminDashboard