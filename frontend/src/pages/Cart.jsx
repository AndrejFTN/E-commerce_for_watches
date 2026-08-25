import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
    Container, Box, Typography, IconButton, Button, Divider, Paper, CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { imageUrl } from '../api/watchApi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)

const SHIPPING_COST = 20
const FREE_FROM_QTY = 2

function Row({ label, value, bold }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'}>{label}</Typography>
            <Typography variant="body2" fontWeight={bold ? 600 : 400}>{value}</Typography>
        </Box>
    )
}

function Cart() {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { showToast } = useToast()
    const { lines, count, loading, setQuantity, removeItem, clearCart } = useCart()

    const subtotal = lines.reduce((s, l) => s + l.effectivePrice * l.quantity, 0)
    const shipping = count >= FREE_FROM_QTY ? 0 : SHIPPING_COST
    const total = subtotal + shipping

    const guard = (fn) => async (...args) => {
        try { await fn(...args) }
        catch (err) { showToast(err.response?.data?.message || 'Greška', 'error') }
    }

    if (loading && lines.length === 0) {
        return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>
    }

    if (lines.length === 0) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Korpa je prazna</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Dodaj satove iz kataloga pa se vrati ovde.
                </Typography>
                <Button component={RouterLink} to="/" variant="outlined"
                        sx={{ borderRadius: '999px', px: 4, py: 1,
                            borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
                            '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary', color: 'background.paper' } }}>
                    Pogledaj katalog
                </Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>Korpa</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.6fr 1fr' }, gap: 4 }}>

                <Box>
                    {lines.map(l => {
                        const overStock = l.quantity > l.stock

                        return (
                            <Box key={l.watchID} sx={{ display: 'flex', gap: 3, py: 3,
                                borderBottom: 1, borderColor: 'divider' }}>

                                <Box component={RouterLink} to={`/watch/${l.watchID}`}
                                     sx={{ width: 110, height: 110, flexShrink: 0, border: 1,
                                         borderColor: 'divider', display: 'flex', p: 1,
                                         alignItems: 'center', justifyContent: 'center' }}>
                                    {l.primaryImageID
                                        ? <Box component="img" src={imageUrl(l.primaryImageID)} alt={l.model}
                                               sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        : <Typography variant="caption" color="text.secondary">—</Typography>}
                                </Box>

                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="overline" sx={{ letterSpacing: '0.12em', fontSize: 10 }}>
                                        {l.brand}
                                    </Typography>
                                    <Typography component={RouterLink} to={`/watch/${l.watchID}`}
                                                variant="h6" sx={{ display: 'block', mb: 0.5,
                                        textDecoration: 'none', color: 'text.primary' }}>
                                        {l.model}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {fmt(l.effectivePrice)} € po komadu
                                    </Typography>

                                    {overStock && (
                                        <Typography variant="caption" color="error"
                                                    sx={{ display: 'block', mt: 0.5 }}>
                                            Na stanju samo {l.stock}
                                        </Typography>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center',
                                            border: 1, borderColor: 'divider', borderRadius: '999px' }}>
                                            <IconButton size="small" disabled={l.quantity <= 1}
                                                        onClick={guard(() => setQuantity(l, l.quantity - 1))}>
                                                <RemoveIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                            <Typography variant="body2" sx={{ minWidth: 26, textAlign: 'center' }}>
                                                {l.quantity}
                                            </Typography>
                                            <IconButton size="small" disabled={l.quantity >= l.stock}
                                                        onClick={guard(() => setQuantity(l, l.quantity + 1))}>
                                                <AddIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Box>

                                        <IconButton size="small" sx={{ ml: 1 }}
                                                    onClick={guard(() => removeItem(l))}>
                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                                    {fmt(l.effectivePrice * l.quantity)} €
                                </Typography>
                            </Box>
                        )
                    })}

                    <Button size="small" onClick={guard(clearCart)}
                            sx={{ mt: 2, color: 'text.secondary', fontSize: 11,
                                '&:hover': { color: 'error.main', bgcolor: 'transparent' } }}>
                        Isprazni korpu
                    </Button>
                </Box>

                <Paper sx={{ border: 1, borderColor: 'divider', p: 3, height: 'fit-content' }}>
                    <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 2 }}>
                        Pregled
                    </Typography>

                    <Row label="Ukupno" value={`${fmt(subtotal)} €`} />
                    <Row label="Dostava" value={shipping === 0 ? 'Besplatno' : `${fmt(shipping)} €`} />

                    {shipping > 0 && (
                        <Typography variant="caption" color="text.secondary">
                            Dodaj još jedan komad za besplatnu dostavu
                        </Typography>
                    )}

                    <Divider sx={{ my: 1.5 }} />
                    <Row label="Za plaćanje" value={`${fmt(total)} €`} bold />

                    <Button fullWidth variant="contained" sx={{ mt: 3, py: 1.3 }}
                            onClick={() => navigate(isLoggedIn ? '/checkout' : '/login')}>
                        Nastavi na porudžbinu
                    </Button>
                </Paper>
            </Box>
        </Container>
    )
}

export default Cart