import { useState } from 'react'
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material'
import { resetPasswordWithToken } from '../api/userApi'
import { useToast } from '../context/ToastContext'

function ResetPassword() {
    const [params] = useSearchParams()
    const token = params.get('token')                  // stize iz linka u mejlu
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [form, setForm] = useState({ newPassword: '', confirmNewPassword: '' })
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)

    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        if (form.newPassword !== form.confirmNewPassword) {
            setError('Lozinke se ne poklapaju')
            return
        }
        setBusy(true); setError(null)
        try {
            await resetPasswordWithToken({ token, ...form })
            showToast('Lozinka je promenjena — prijavi se')
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Link je istekao ili je već iskorišćen')
        } finally { setBusy(false) }
    }

    if (!token) {
        return (
            <Container maxWidth="xs" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Neispravan link</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Link nema token. Zatraži novi sa stranice za zaboravljenu lozinku.
                </Typography>
                <Button component={RouterLink} to="/forgot-password" variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>Zatraži novi link</Button>
            </Container>
        )
    }

    return (
        <Container maxWidth="xs" sx={{ py: 8 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Nova lozinka</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Postavi novu lozinku za svoj nalog.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>{error}</Alert>}

            <Box component="form" onSubmit={submit}>
                <TextField name="newPassword" label="Nova lozinka" type="password"
                           fullWidth required sx={{ mb: 2 }}
                           value={form.newPassword} onChange={change}
                           helperText="Min. 8 karaktera, veliko i malo slovo i cifra" />
                <TextField name="confirmNewPassword" label="Potvrdi lozinku" type="password"
                           fullWidth required sx={{ mb: 3 }}
                           value={form.confirmNewPassword} onChange={change} />

                <Button type="submit" fullWidth variant="contained" disabled={busy}
                        sx={{ py: 1.3, borderRadius: '999px' }}>
                    {busy ? 'Čuvanje…' : 'Sačuvaj lozinku'}
                </Button>
            </Box>
        </Container>
    )
}

export default ResetPassword