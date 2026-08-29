import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    Container, Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Chip, Pagination, CircularProgress, Alert, TextField,
} from '@mui/material'
import { adminGetAllOrders } from '../api/orderApi'
import { StatusChip } from './Orders'
import AdminNav from '../components/AdminNav'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)
const fmtDate = (d) => new Date(d).toLocaleString('sr-RS', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

const FILTERS = [
    { key: '',          label: 'Sve' },
    { key: 'PENDING',   label: 'Čekaju plaćanje' },
    { key: 'PAID',      label: 'Plaćene' },
    { key: 'CANCELLED', label: 'Otkazane' },
]

const PAGE_SIZE = 15

function AdminOrders() {
    const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
    const [status, setStatus] = useState('')
    const [user, setUser] = useState('')
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        const params = { page, size: PAGE_SIZE, sort: 'dateOfOrder,desc' }
        if (status) params.status = status

        adminGetAllOrders(params)
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.message || e.message))
            .finally(() => setLoading(false))
    }, [status, page])

    const visible = user
        ? data.content.filter(o => o.userName?.toLowerCase().includes(user.toLowerCase()))
        : data.content

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Admin panel</Typography>
            <AdminNav />

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                {FILTERS.map(f => (
                    <Chip key={f.key} label={f.label} size="small" clickable
                          onClick={() => { setStatus(f.key); setPage(0) }}
                          sx={{ borderRadius: '999px', fontSize: 11,
                              bgcolor: status === f.key ? 'text.primary' : 'transparent',
                              color: status === f.key ? 'background.paper' : 'text.primary',
                              border: 1, borderColor: 'divider' }} />
                ))}

                <TextField size="small" placeholder="Filtriraj po korisniku"
                           value={user} onChange={e => setUser(e.target.value)}
                           sx={{ ml: 'auto', minWidth: 220 }} />
            </Box>

            {loading && <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <Paper sx={{ border: 1, borderColor: 'divider', overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Datum</TableCell>
                                <TableCell>Korisnik</TableCell>
                                <TableCell>Adresa</TableCell>
                                <TableCell align="right">Stavki</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Iznos</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.content.map(o => (
                                <TableRow key={o.orderID} hover
                                          component={RouterLink} to={`/orders/${o.orderID}`}
                                          sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                                    <TableCell>{fmtDate(o.dateOfOrder)}</TableCell>
                                    <TableCell>{o.userName}</TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {o.address}, {o.zipCode}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">{o.orderItems?.length ?? 0}</TableCell>
                                    <TableCell><StatusChip status={o.status} /></TableCell>
                                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                        {fmt(o.grandTotal)} €
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            {data.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={data.totalPages} page={data.number + 1}
                                onChange={(e, p) => setPage(p - 1)} shape="rounded" />
                </Box>
            )}
        </Container>
    )
}

export default AdminOrders