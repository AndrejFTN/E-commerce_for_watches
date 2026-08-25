import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Alert, Divider } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { IconButton, InputAdornment } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const { showToast } = useToast()
    const [showPass, setShowPass] = useState(false)

    const [form, setForm] = useState({ userName: '', password: '' })
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)

    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setBusy(true)
        setError(null)
        try {
            await login(form.userName, form.password)
            showToast('Uspešno ste prijavljeni')
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Neispravno korisničko ime ili lozinka')
        } finally {
            setBusy(false)
        }
    }

    return (
        <Container maxWidth="xs" sx={{ py: 8 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Prijava</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Prijavi se da bi završio kupovinu i pratio porudžbine.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>{error}</Alert>}

            <Box component="form" onSubmit={submit}>
                <TextField name="userName" label="Korisničko ime" fullWidth required
                           value={form.userName} onChange={change} sx={{ mb: 2 }} />
                <TextField name="password" label="Lozinka"
                           type={showPass ? 'text' : 'password'}   // jedina prava promena
                           fullWidth required
                           value={form.password} onChange={change} sx={{ mb: 1 }}
                           slotProps={{
                               input: {
                                   endAdornment: (
                                       <InputAdornment position="end">
                                           <IconButton onClick={() => setShowPass(s => !s)} edge="end" size="small">
                                               {showPass ? <VisibilityOffIcon fontSize="small" />
                                                   : <VisibilityIcon fontSize="small" />}
                                           </IconButton>
                                       </InputAdornment>
                                   ),
                               },
                           }} />
                <Box sx={{ textAlign: 'right', mb: 3 }}>
                    <Typography component={RouterLink} to="/forgot-password" variant="caption"
                                sx={{ color: 'text.secondary', textDecoration: 'none',
                                    '&:hover': { color: 'text.primary' } }}>
                        Zaboravljena lozinka?
                    </Typography>
                </Box>

                <Button type="submit" fullWidth variant="contained" disabled={busy}
                        sx={{ py: 1.3, borderRadius: '999px' }}>
                    {busy ? 'Prijavljivanje…' : 'Prijavi se'}
                </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Nemaš nalog?{' '}
                <Typography component={RouterLink} to="/register" variant="body2"
                            sx={{ color: 'text.primary', fontWeight: 500 }}>
                    Registruj se
                </Typography>
            </Typography>
        </Container>
    )
}

export default Login