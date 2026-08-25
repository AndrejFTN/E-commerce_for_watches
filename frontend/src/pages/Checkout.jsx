import { useEffect, useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
    Container, Box, Typography, TextField, Button, Alert, Divider, Paper, CircularProgress,
} from '@mui/material'
import { createOrder, checkout } from '../api/orderApi'
import { getMyInfo } from '../api/userApi'
import { imageUrl } from '../api/watchApi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)

const SHIPPING_COST = 20
const FREE_FROM_QTY = 2

const EMPTY = { address: '', zipCode: '', mail: '', phoneNumber: '' }

function Checkout() {
    const navigate = useNavigate()
    const { isLoggedIn } = useAuth()
    const { lines, count, reload } = useCart()

    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)
    const [loadingInfo, setLoadingInfo] = useState(true)

    useEffect(() => {                                  // mejl i telefon se popune iz profila
        if (!isLoggedIn) { setLoadingInfo(false); return }
        getMyInfo()
            .then(r => setForm(f => ({ ...f, mail: r.data.email ?? '', phoneNumber: r.data.phone ?? '' })))
            .catch(() => {})
            .finally(() => setLoadingInfo(false))
    }, [isLoggedIn])

    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const subtotal = lines.reduce((s, l) => s + l.effectivePrice * l.quantity, 0)
    const shipping = count >= FREE_FROM_QTY ? 0 : SHIPPING_COST
    const total = subtotal + shipping

    const submit = async (e) => {
        e.preventDefault()
        setBusy(true)
        setError(null)
        try {
            const order = await createOrder(form)      // skida robu sa lagera i prazni korpu
            await reload()
            const url = await checkout(order.data.orderID)   // vraća Stripe adresu
            window.location.href = url.data            // odlazak sa sajta na Stripe stranicu
        } catch (err) {
            setError(err.response?.data?.message || 'Porudžbina nije uspela')
            setBusy(false)
        }
    }

    if (!isLoggedIn) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Porudžbina</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Prijavi se da bi završio kupovinu.
                </Typography>
                <Button component={RouterLink} to="/login" variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>Prijavi se</Button>
            </Container>
        )
    }

    if (loadingInfo) return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>

    if (lines.length === 0) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Korpa je prazna</Typography>
                <Button component={RouterLink} to="/" variant="outlined"
                        sx={{ borderRadius: '999px', px: 4,
                            borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
                            '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary', color: 'background.paper' } }}>
                    Pogledaj katalog
                </Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>Porudžbina</Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, gap: 4 }}>

                <Paper sx={{ border: 1, borderColor: 'divider', p: 3 }}>
                    <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 2 }}>
                        Podaci za dostavu
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{error}</Alert>}

                    <Box component="form" onSubmit={submit} id="checkout-form">
                        <TextField name="address" label="Adresa" size="small" fullWidth required sx={{ mb: 2 }}
                                   value={form.address} onChange={change}
                                   helperText="Ulica i broj, grad" />
                        <TextField name="zipCode" label="Poštanski broj" size="small" fullWidth required sx={{ mb: 2 }}
                                   value={form.zipCode} onChange={change}
                                   helperText="Samo cifre, npr. 11000" />
                        <TextField name="phoneNumber" label="Telefon" size="small" fullWidth required sx={{ mb: 2 }}
                                   value={form.phoneNumber} onChange={change} />
                        <TextField name="mail" label="Email za potvrdu" type="email" size="small" fullWidth required
                                   value={form.mail} onChange={change} />
                    </Box>
                </Paper>

                <Paper sx={{ border: 1, borderColor: 'divider', p: 3, height: 'fit-content' }}>
                    <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 2 }}>
                        Pregled porudžbine
                    </Typography>

                    {lines.map(l => (
                        <Box key={l.watchID} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
                            <Box sx={{ width: 48, height: 48, flexShrink: 0, border: 1, borderColor: 'divider',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5 }}>
                                {l.primaryImageID
                                    ? <Box component="img" src={imageUrl(l.primaryImageID)} alt={l.model}
                                           sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    : <Typography variant="caption" color="text.secondary">—</Typography>}
                            </Box>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="body2" noWrap>{l.brand} {l.model}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {l.quantity} × {fmt(l.effectivePrice)} €
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                {fmt(l.effectivePrice * l.quantity)} €
                            </Typography>
                        </Box>
                    ))}

                    <Divider sx={{ my: 2 }} />

                    <Row label="Ukupno" value={`${fmt(subtotal)} €`} />
                    <Row label="Dostava" value={shipping === 0 ? 'Besplatno' : `${fmt(shipping)} €`} />
                    <Divider sx={{ my: 1.5 }} />
                    <Row label="Za plaćanje" value={`${fmt(total)} €`} bold />

                    <Button type="submit" form="checkout-form" fullWidth variant="contained"
                            disabled={busy} sx={{ mt: 3, py: 1.3 }}>
                        {busy ? 'Kreiranje porudžbine…' : 'Plati karticom'}
                    </Button>

                    <Typography variant="caption" color="text.secondary"
                                sx={{ display: 'block', mt: 1.5, textAlign: 'center' }}>
                        Plaćanje se obavlja na zaštićenoj Stripe stranici.
                    </Typography>
                </Paper>
            </Box>
        </Container>
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

export default Checkout