import { useEffect, useState } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, Box,
} from '@mui/material'

function StockDialog({ watch, onClose, onConfirm }) {
    const [amount, setAmount] = useState('1')
    const [busy, setBusy] = useState(false)

    useEffect(() => { if (watch) setAmount('1') }, [watch])

    const submit = async (e) => {
        e.preventDefault()
        const n = Number(amount)
        if (!Number.isInteger(n) || n < 1) return

        setBusy(true)
        try { await onConfirm(n) } finally { setBusy(false) }
    }

    return (
        <Dialog open={Boolean(watch)} onClose={busy ? undefined : onClose} maxWidth="xs" fullWidth
                slotProps={{ paper: { sx: { border: 1, borderColor: 'divider' } } }}>
            <DialogTitle sx={{ fontSize: 18 }}>Dopuna stanja</DialogTitle>

            <DialogContent dividers>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {watch?.brand} {watch?.model} — trenutno na stanju <strong>{watch?.stock}</strong>
                </Typography>

                <Box component="form" id="stock-form" onSubmit={submit}>
                    <TextField autoFocus type="number" size="small" fullWidth
                               label="Koliko komada dodati"
                               value={amount} onChange={e => setAmount(e.target.value)}
                               slotProps={{ htmlInput: { min: 1 } }} />
                </Box>

                {Number(amount) >= 1 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Novo stanje: {(watch?.stock ?? 0) + Number(amount)}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={busy} sx={{ color: 'text.secondary' }}>Odustani</Button>
                <Button type="submit" form="stock-form" variant="contained" disabled={busy}
                        sx={{ borderRadius: '999px', px: 3 }}>Dodaj</Button>
            </DialogActions>
        </Dialog>
    )
}

export default StockDialog