import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    Container, Box, Typography, Chip, Button, Pagination, CircularProgress, Alert, Paper,
} from '@mui/material'
import { getAllOrders, getOrdersByStatus } from '../api/orderApi'
import { useAuth } from '../context/AuthContext'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)

const fmtDate = (d) => new Date(d).toLocaleString('sr-RS', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

export const STATUS = {
    PENDING:   { label: 'Čeka plaćanje', filled: false },
    APPROVED:  { label: 'Odobrena',      filled: true },
    PAID:      { label: 'Plaćena',       filled: true },
    CANCELLED: { label: 'Otkazana',      filled: false },
}

export function StatusChip({ status }) {
    const s = STATUS[status] ?? { label: status, filled: false }
    return (
        <Chip size="small" label={s.label}
              sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.1em',
                  bgcolor: s.filled ? 'text.primary' : 'transparent',
                  color: s.filled ? 'background.paper' : 'text.primary',
                  border: 1, borderColor: 'text.primary' }} />
    )
}

const FILTERS = [
    { key: '',          label: 'Sve' },
    { key: 'PENDING',   label: 'Čekaju plaćanje' },
    { key: 'PAID',      label: 'Plaćene' },
    { key: 'CANCELLED', label: 'Otkazane' },
]

const PAGE_SIZE = 8

function Orders() {
    const { isLoggedIn } = useAuth()

    const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoggedIn) { setLoading(false); return }
        setLoading(true)
        setError(null)

        const params = { page, size: PAGE_SIZE, sort: 'dateOfOrder,desc' }
        const call = status
            ? getOrdersByStatus({ ...params, status })
            : getAllOrders(params)

        call
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.message || e.message))
            .finally(() => setLoading(false))
    }, [isLoggedIn, status, page])

    if (!isLoggedIn) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Moje porudžbine</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Prijavi se da bi video svoje porudžbine.
                </Typography>
                <Button component={RouterLink} to="/login" variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>Prijavi se</Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Moje porudžbine</Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                {FILTERS.map(f => (
                    <Chip key={f.key} label={f.label} size="small" clickable
                          onClick={() => { setStatus(f.key); setPage(0) }}
                          sx={{ borderRadius: '999px', fontSize: 11,
                              bgcolor: status === f.key ? 'text.primary' : 'transparent',
                              color: status === f.key ? 'background.paper' : 'text.primary',
                              border: 1, borderColor: 'divider',
                              '&:hover': { bgcolor: status === f.key ? '#000' : 'action.hover' } }} />
                ))}
            </Box>

            {loading && <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && data.content.length === 0 && (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Nema porudžbina.
                    </Typography>
                    <Button component={RouterLink} to="/" variant="outlined"
                            sx={{ borderRadius: '999px', px: 4,
                                borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
                                '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary', color: 'background.paper' } }}>
                        Pogledaj katalog
                    </Button>
                </Box>
            )}

            {!loading && !error && data.content.map(o => (
                <Paper key={o.orderID} component={RouterLink} to={`/orders/${o.orderID}`}
                       sx={{ display: 'block', textDecoration: 'none', color: 'inherit',
                           border: 1, borderColor: 'divider', p: 2.5, mb: 2,
                           '&:hover': { borderColor: 'text.primary' } }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {fmtDate(o.dateOfOrder)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {o.orderItems?.length ?? 0}{' '}
                                {o.orderItems?.length === 1 ? 'stavka' : 'stavki'} ·{' '}
                                {o.address}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <StatusChip status={o.status} />
                            <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {fmt(o.grandTotal)} €
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            ))}

            {data.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={data.totalPages} page={data.number + 1}
                                onChange={(e, p) => setPage(p - 1)} shape="rounded" />
                </Box>
            )}
        </Container>
    )
}

export default Orders