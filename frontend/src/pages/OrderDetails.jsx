import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
    Container, Box, Typography, Button, Divider, Paper, CircularProgress, Alert, Breadcrumbs,
} from '@mui/material'
import { getOrder, adminGetOrder, cancelOrder, checkout } from '../api/orderApi'
import { StatusChip } from './Orders'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)

const fmtDate = (d) => new Date(d).toLocaleString('sr-RS', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

function Row({ label, value, bold }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'}>{label}</Typography>
            <Typography variant="body2" fontWeight={bold ? 600 : 400}>{value}</Typography>
        </Box>
    )
}

function OrderDetails() {
    const { orderID } = useParams()
    const { showToast } = useToast()
    const { isAdmin } = useAuth()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)

    const load = () => {
        setLoading(true)
        const call = isAdmin ? adminGetOrder : getOrder   // admin sme da vidi svaciju
        call(orderID)
            .then(r => setOrder(r.data))
            .catch(e => setError(e.response?.status === 404
                ? 'Porudžbina nije pronađena.'
                : e.response?.data?.message || e.message))
            .finally(() => setLoading(false))
    }

    useEffect(load, [orderID, isAdmin])

    const pay = async () => {
        setBusy(true)
        try {
            const url = await checkout(orderID)
            window.location.href = url.data            // nastavak plaćanja na Stripe stranici
        } catch (err) {
            showToast(err.response?.data?.message || 'Plaćanje nije moguće', 'error')
            setBusy(false)
        }
    }

    const cancel = async () => {
        setBusy(true)
        try {
            await cancelOrder(orderID)
            showToast('Porudžbina je otkazana', 'info')
            load()                                     // status se osveži sa backenda
        } catch (err) {
            showToast(err.response?.data?.message || 'Otkazivanje nije uspelo', 'error')
        } finally { setBusy(false) }
    }

    if (loading) return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>
    if (error)   return <Container sx={{ py: 8 }}><Alert severity="error">{error}</Alert></Container>
    if (!order)  return null

    const canPay = order.status === 'PENDING'
    const canCancel = order.status === 'PENDING'       // backend odbija otkazivanje plaćene

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Breadcrumbs sx={{ mb: 3, fontSize: 13 }}>
                <Typography component={RouterLink} to="/orders"
                            sx={{ textDecoration: 'none', color: 'text.secondary', fontSize: 13 }}>
                    Moje porudžbine
                </Typography>
                <Typography sx={{ fontSize: 13 }}>{fmtDate(order.dateOfOrder)}</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Typography variant="h4">Porudžbina</Typography>
                <StatusChip status={order.status} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }, gap: 3 }}>

                <Paper sx={{ border: 1, borderColor: 'divider', p: 3 }}>
                    <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 2 }}>
                        Stavke
                    </Typography>

                    {order.orderItems?.map((it, i) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between',
                            gap: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {it.brand} {it.model}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {it.color} · {it.mechanism} · {it.amount} × {fmt(it.price)} €
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                                {fmt(it.price * it.amount)} €
                            </Typography>
                        </Box>
                    ))}

                    <Box sx={{ mt: 3 }}>
                        <Row label="Ukupno" value={`${fmt(order.totalAmount)} €`} />
                        <Row label="Dostava"
                             value={order.shippingCost === 0 ? 'Besplatno' : `${fmt(order.shippingCost)} €`} />
                        <Divider sx={{ my: 1.5 }} />
                        <Row label="Za plaćanje" value={`${fmt(order.grandTotal)} €`} bold />
                    </Box>
                </Paper>

                <Box>
                    <Paper sx={{ border: 1, borderColor: 'divider', p: 3, mb: 3 }}>
                        <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 2 }}>
                            Dostava
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>{order.address}</Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>{order.zipCode}</Typography>
                        <Typography variant="body2" color="text.secondary">{order.phoneNumber}</Typography>
                        <Typography variant="body2" color="text.secondary">{order.mail}</Typography>
                    </Paper>

                    {(canPay || canCancel) && (
                        <Paper sx={{ border: 1, borderColor: 'divider', p: 3 }}>
                            {canPay && (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Porudžbina čeka plaćanje. Ako ne bude plaćena u roku od 30 minuta
                                        od kreiranja, automatski se otkazuje.
                                    </Typography>
                                    <Button fullWidth variant="contained" onClick={pay} disabled={busy}
                                            sx={{ py: 1.2, mb: 1.5 }}>
                                        Plati karticom
                                    </Button>
                                </>
                            )}

                            {canCancel && (
                                <Button fullWidth size="small" onClick={cancel} disabled={busy}
                                        sx={{ color: 'text.secondary', fontSize: 11,
                                            '&:hover': { color: 'error.main', bgcolor: 'transparent' } }}>
                                    Otkaži porudžbinu
                                </Button>
                            )}
                        </Paper>
                    )}
                </Box>
            </Box>
        </Container>
    )
}

export default OrderDetails