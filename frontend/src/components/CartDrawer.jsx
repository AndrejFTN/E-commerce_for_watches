import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Drawer, Box, Typography, IconButton, Button, Divider, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { getOneWatch, imageUrl } from '../api/watchApi'
import { useCart } from '../context/CartContext'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)

const SHIPPING_COST = 20                               // ista pravila kao na backendu
const FREE_FROM_QTY = 2

export const DRAWER_WIDTH = 400                        // deli se sa jezičkom sa strane

const primaryId = (w) =>                               // Jackson šalje "primary", ne "isPrimary"
    (w.images ?? []).find(i => i.primary)?.imageID ?? w.images?.[0]?.imageID

function CartDrawer({ open, onClose }) {
    const navigate = useNavigate()
    const { items, count, setQuantity, removeFromCart } = useCart()
    const [watches, setWatches] = useState({})
    const [loading, setLoading] = useState(false)

    const ids = items.map(i => i.watchID).join(',')     // menja se samo kad se doda/ukloni sat

    useEffect(() => {
        if (!open || items.length === 0) return
        setLoading(true)
        Promise.all(items.map(i => getOneWatch(i.watchID)))   // jedan poziv po stavci
            .then(res => {
                const map = {}
                res.forEach(r => { map[r.data.watchID] = r.data })
                setWatches(map)                          // podaci se čitaju SVEŽI, ne iz localStorage
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [open, ids])                                      // eslint-disable-line

    const lines = items
        .map(i => ({ ...i, watch: watches[i.watchID] }))
        .filter(l => l.watch)                            // dok se ne učita, stavka se preskače

    const subtotal = lines.reduce((s, l) => s + l.watch.effectivePrice * l.quantity, 0)
    const shipping = count >= FREE_FROM_QTY ? 0 : SHIPPING_COST
    const total = subtotal + shipping

    const goToCheckout = () => {
        onClose()
        navigate(localStorage.getItem('token') ? '/checkout' : '/login')
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
                {items.length === 0 && (
                    <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
                        Korpa je prazna.
                    </Typography>
                )}

                {loading && lines.length === 0 && items.length > 0 && (
                    <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress size={28} /></Box>
                )}

                {lines.map(l => {
                    const img = primaryId(l.watch)
                    const overStock = l.quantity > l.watch.stock      // gost je mogao da doda previše

                    return (
                        <Box key={l.watchID} sx={{ display: 'flex', gap: 2, py: 2.5,
                            borderBottom: 1, borderColor: 'divider' }}>

                            <Box sx={{ width: 72, height: 72, flexShrink: 0, border: 1,
                                borderColor: 'divider', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', p: 0.5 }}>
                                {img
                                    ? <Box component="img" src={imageUrl(img)} alt={l.watch.model}
                                           sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    : <Typography variant="caption" color="text.secondary">—</Typography>}
                            </Box>

                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="overline" sx={{ letterSpacing: '0.12em', fontSize: 10 }}>
                                    {l.watch.brand}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                                    {l.watch.model}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {fmt(l.watch.effectivePrice)} €
                                </Typography>

                                {overStock && (
                                    <Typography variant="caption" color="error">
                                        Na stanju samo {l.watch.stock}
                                    </Typography>
                                )}

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                    <IconButton size="small" disabled={l.quantity <= 1}
                                                onClick={() => setQuantity(l.watchID, l.quantity - 1)}>
                                        <RemoveIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>
                                        {l.quantity}
                                    </Typography>
                                    <IconButton size="small" disabled={l.quantity >= l.watch.stock}
                                                onClick={() => setQuantity(l.watchID, l.quantity + 1)}>
                                        <AddIcon sx={{ fontSize: 16 }} />
                                    </IconButton>

                                    <IconButton size="small" sx={{ ml: 'auto' }}
                                                onClick={() => removeFromCart(l.watchID)}>
                                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    )
                })}
            </Box>

            {items.length > 0 && (
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
                    <Row label="Ukupno" value={`${fmt(total)} €`} bold />

                    <Button fullWidth variant="contained" onClick={goToCheckout} sx={{ mt: 2, py: 1.2 }}>
                        Nastavi na porudžbinu
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