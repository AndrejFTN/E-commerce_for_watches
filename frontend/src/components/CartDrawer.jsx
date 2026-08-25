import { useNavigate } from 'react-router-dom'
import { Drawer, Box, Typography, IconButton, Button, Divider, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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

export const DRAWER_WIDTH = 340

function CartDrawer({ open, onClose }) {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { showToast } = useToast()
    const { lines, count, loading, setQuantity, removeItem, clearCart } = useCart()

    const subtotal = lines.reduce((s, l) => s + l.effectivePrice * l.quantity, 0)
    const shipping = count >= FREE_FROM_QTY ? 0 : SHIPPING_COST
    const total = subtotal + shipping

    const goToCheckout = () => {
        onClose()
        navigate(isLoggedIn ? '/checkout' : '/login')
    }

    const handleClear = async () => {
        try {
            await clearCart()
            showToast('Korpa je ispražnjena', 'info')
        } catch (err) {
            showToast(err.response?.data?.message || 'Greška pri pražnjenju korpe', 'error')
        }
    }

    const guard = (fn) => async (...args) => {         // svaka radnja može da padne na backendu
        try { await fn(...args) }
        catch (err) { showToast(err.response?.data?.message || 'Greška', 'error') }
    }

    return (
        <Drawer anchor="right" variant="persistent" open={open}
                slotProps={{ paper: { sx: { width: DRAWER_WIDTH, maxWidth: '100vw' } } }}>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="overline" sx={{ letterSpacing: '0.15em', fontSize: 13 }}>
                    Korpa {count > 0 && `(${count})`}
                </Typography>
                <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3 }}>
                {loading && lines.length === 0 && (
                    <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress size={28} /></Box>
                )}

                {!loading && lines.length === 0 && (
                    <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
                        Korpa je prazna.
                    </Typography>
                )}

                {lines.map(l => {
                    const overStock = l.quantity > l.stock

                    return (
                        <Box key={l.watchID} sx={{ display: 'flex', gap: 2, py: 2.5,
                            borderBottom: 1, borderColor: 'divider' }}>

                            <Box sx={{ width: 72, height: 72, flexShrink: 0, border: 1,
                                borderColor: 'divider', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', p: 0.5 }}>
                                {l.primaryImageID
                                    ? <Box component="img" src={imageUrl(l.primaryImageID)} alt={l.model}
                                           sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    : <Typography variant="caption" color="text.secondary">—</Typography>}
                            </Box>

                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="overline" sx={{ letterSpacing: '0.12em', fontSize: 10 }}>
                                    {l.brand}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                                    {l.model}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {fmt(l.effectivePrice)} €
                                </Typography>

                                {overStock && (
                                    <Typography variant="caption" color="error">
                                        Na stanju samo {l.stock}
                                    </Typography>
                                )}

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                    <IconButton size="small" disabled={l.quantity <= 1}
                                                onClick={guard(() => setQuantity(l, l.quantity - 1))}>
                                        <RemoveIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>
                                        {l.quantity}
                                    </Typography>
                                    <IconButton size="small" disabled={l.quantity >= l.stock}
                                                onClick={guard(() => setQuantity(l, l.quantity + 1))}>
                                        <AddIcon sx={{ fontSize: 16 }} />
                                    </IconButton>

                                    <IconButton size="small" sx={{ ml: 'auto' }}
                                                onClick={guard(() => removeItem(l))}>
                                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    )
                })}
            </Box>

            {lines.length > 0 && (
                <Box sx={{ px: 3, py: 2.5, borderTop: 1, borderColor: 'divider' }}>
                    <Row label="Ukupno" value={`${fmt(subtotal)} €`} />
                    <Row label="Dostava"
                         value={shipping === 0 ? 'Besplatno' : `${fmt(shipping)} €`} />

                    {shipping > 0 && (
                        <Typography variant="caption" color="text.secondary">
                            Dodaj još jedan komad za besplatnu dostavu
                        </Typography>
                    )}

                    <Divider sx={{ my: 1.5 }} />
                    <Row label="Za plaćanje" value={`${fmt(total)} €`} bold />

                    <Button fullWidth variant="contained" onClick={goToCheckout} sx={{ mt: 2, py: 1.2 }}>
                        Nastavi na porudžbinu
                    </Button>

                    <Button fullWidth size="small" onClick={handleClear}
                            sx={{ mt: 1, color: 'text.secondary', fontSize: 11,
                                '&:hover': { color: 'error.main', bgcolor: 'transparent' } }}>
                        Isprazni korpu
                    </Button>
                </Box>
            )}
        </Drawer>
    )
}

function Row({ label, value, bold }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'}>{label}</Typography>
            <Typography variant="body2" fontWeight={bold ? 600 : 400}>{value}</Typography>
        </Box>
    )
}

export default CartDrawer