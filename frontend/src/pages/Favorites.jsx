import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, Pagination, CircularProgress, Alert, Button } from '@mui/material'
import { getMyFavorites } from '../api/favoriteApi'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import WatchCard from '../components/WatchCard'

const PAGE_SIZE = 12

function Favorites() {
    const { isLoggedIn } = useAuth()
    const { isFavorite } = useFavorites()

    const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!isLoggedIn) { setLoading(false); return }
        setLoading(true)
        getMyFavorites({ page, size: PAGE_SIZE, sortBy: 'dateAdded', sortDir: 'desc' })
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.message || e.message))
            .finally(() => setLoading(false))
    }, [isLoggedIn, page])

    if (!isLoggedIn) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Omiljeni</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Prijavi se da bi video satove koje si sačuvao.
                </Typography>
                <Button component={RouterLink} to="/login" variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>Prijavi se</Button>
            </Container>
        )
    }

    // sat koji upravo ukloniš iz favorita nestaje odmah, bez novog poziva
    const visible = data.content.filter(f => isFavorite(f.watchID))

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Omiljeno</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Sačuvano: {data.totalElements}
            </Typography>

            {loading && <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && visible.length === 0 && (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Još nemaš sačuvanih satova.
                    </Typography>
                    <Button component={RouterLink} to="/" variant="outlined"
                            sx={{ borderRadius: '999px', px: 4, py: 1,
                                borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
                                '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary',
                                    color: 'background.paper' } }}>
                        Pogledaj katalog
                    </Button>
                </Box>
            )}

            {!loading && !error && visible.length > 0 && (
                <Box sx={{ display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
                    gap: 3 }}>
                    {visible.map(f => <WatchCard key={f.watchID} watch={f} />)}
                </Box>
            )}

            {data.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <Pagination count={data.totalPages} page={data.number + 1}
                                onChange={(e, p) => setPage(p - 1)} shape="rounded" />
                </Box>
            )}
        </Container>
    )
}

export default Favorites