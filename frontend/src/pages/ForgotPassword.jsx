import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material'
import { forgotPassword } from '../api/userApi'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        setBusy(true); setError(null)
        try {
            await forgotPassword({ email })
            setSent(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Slanje nije uspelo')
        } finally { setBusy(false) }
    }

    if (sent) {
        return (
            <Container maxWidth="xs" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Proveri mejl</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Ako nalog sa adresom <strong>{email}</strong> postoji, poslali smo link
                    za postavljanje nove lozinke. Link važi sat vremena.
                </Typography>
                <Button component={RouterLink} to="/login" variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>Nazad na prijavu</Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="xs" sx={{ py: 8 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Zaboravljena lozinka</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Unesi adresu naloga i poslaćemo ti link za postavljanje nove lozinke.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>{error}</Alert>}

            <Box component="form" onSubmit={submit}>
                <TextField label="Email" type="email" fullWidth required sx={{ mb: 3 }}
                           value={email} onChange={e => setEmail(e.target.value)} />

                <Button type="submit" fullWidth variant="contained" disabled={busy}
                        sx={{ py: 1.3, borderRadius: '999px' }}>
                    {busy ? 'Slanje…' : 'Pošalji link'}
                </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                <Typography component={RouterLink} to="/login" variant="body2"
                            sx={{ color: 'text.primary', fontWeight: 500 }}>
                    Nazad na prijavu
                </Typography>
            </Typography>
        </Container>
    )
}

export default ForgotPassword