import { useEffect, useState } from 'react'
import {
    Container, Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
    Chip, Pagination, CircularProgress, Alert, TextField, MenuItem,
} from '@mui/material'
import { getUsersPage } from '../api/adminApi'
import AdminNav from '../components/AdminNav'
import { useSearchParams } from 'react-router-dom'

const PAGE_SIZE = 15

function AdminUsers() {
    const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
    const [page, setPage] = useState(0)
    const [term, setTerm] = useState('')
    const [params] = useSearchParams()
    const onlyUnverified = params.get('filter') === 'unverified'
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sort, setSort] = useState('registrationDate,desc')

    const fmtDate = (d) => d
        ? new Date(d).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '—'

    useEffect(() => {
        setLoading(true)
        getUsersPage({ page, size: PAGE_SIZE, sort})
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.message || e.message))
            .finally(() => setLoading(false))
    }, [page, sort])

    const visible = data.content
        .filter(u => !onlyUnverified || !u.verified)
        .filter(u => !term ||
            (u.userName + u.email + (u.fullName ?? '')).toLowerCase().includes(term.toLowerCase()))

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Admin panel</Typography>
            <AdminNav />

            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField size="small" placeholder="Pretraga po imenu ili mejlu"
                           value={term} onChange={e => setTerm(e.target.value)}
                           sx={{ minWidth: 280 }} />
                <TextField size="small" select value={sort}
                           onChange={e => { setSort(e.target.value); setPage(0) }}
                           sx={{ minWidth: 200 }}>
                    <MenuItem value="registrationDate,desc">Najnoviji prvo</MenuItem>
                    <MenuItem value="registrationDate,asc">Najstariji prvo</MenuItem>
                    <MenuItem value="userName,asc">Korisničko ime A-Ž</MenuItem>
                </TextField>
                <Typography variant="body2" color="text.secondary">
                    Ukupno: {data.totalElements}
                </Typography>
            </Box>

            {loading && <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <Paper sx={{ border: 1, borderColor: 'divider', overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Korisničko ime</TableCell>
                                <TableCell>Ime i prezime</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Telefon</TableCell>
                                <TableCell>Registrovan</TableCell>
                                <TableCell>Verifikacija</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {visible.map(u => (
                                <TableRow key={u.userName} hover>
                                    <TableCell>{u.userName}</TableCell>
                                    <TableCell>{u.fullName}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>{u.phone}</TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {fmtDate(u.registrationDate)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="small"
                                              label={u.verified ? 'Verifikovan' : 'Nije'}
                                              sx={{ borderRadius: 0, height: 20, fontSize: 10,
                                                  bgcolor: u.verified ? 'text.primary' : 'transparent',
                                                  color: u.verified ? 'background.paper' : 'text.primary',
                                                  border: 1, borderColor: 'text.primary' }} />
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

export default AdminUsers