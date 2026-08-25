import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, TextField, Button, Alert, Divider, IconButton, InputAdornment } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'


const EMPTY = { userName: '', fullName: '', email: '', phone: '', password: '', confirm: '' }

function Register() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const { showToast } = useToast()
    const [showPass, setShowPass] = useState(false)

    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)

    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()

        if (form.password !== form.confirm) {          // provera koju backend ne radi
            setError('Lozinke se ne poklapaju')
            return
        }

        setBusy(true)
        setError(null)
        try {
            const { confirm, ...payload } = form        // 'confirm' se ne šalje backendu
            await register(payload)                     // registruje pa odmah prijavljuje
            showToast('Nalog je napravljen — proveri mejl za verifikaciju')
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registracija nije uspela')
        } finally {
            setBusy(false)
        }
    }

    return (
        <Container maxWidth="xs" sx={{ py: 8 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Registracija</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Napravi nalog da bi mogao da poručuješ i pratiš isporuku.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>{error}</Alert>}

            <Box component="form" onSubmit={submit}>
                <TextField name="userName" label="Korisničko ime" fullWidth required
                           value={form.userName} onChange={change} sx={{ mb: 2 }}
                           helperText="4 do 20 karaktera" />
                <TextField name="fullName" label="Ime i prezime" fullWidth required
                           value={form.fullName} onChange={change} sx={{ mb: 2 }} />
                <TextField name="email" label="Email" type="email" fullWidth required
                           value={form.email} onChange={change} sx={{ mb: 2 }} />
                <TextField name="phone" label="Telefon" fullWidth required
                           value={form.phone} onChange={change} sx={{ mb: 2 }}
                           helperText="npr. +381641234567" />
                <TextField name="password" label="Lozinka"
                           type={showPass ? 'text' : 'password'}
                           fullWidth required
                           value={form.password} onChange={change} sx={{ mb: 2 }}
                           helperText="Min. 8 karaktera, veliko i malo slovo i cifra"
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
                <TextField name="confirm" label="Potvrdi lozinku"
                           type={showPass ? 'text' : 'password'}
                           fullWidth required
                           value={form.confirm} onChange={change} sx={{ mb: 3 }} />
                <Button type="submit" fullWidth variant="contained" disabled={busy}
                        sx={{ py: 1.3, borderRadius: '999px' }}>
                    {busy ? 'Kreiranje naloga…' : 'Registruj se'}
                </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Već imaš nalog?{' '}
                <Typography component={RouterLink} to="/login" variant="body2"
                            sx={{ color: 'text.primary', fontWeight: 500 }}>
                    Prijavi se
                </Typography>
            </Typography>
        </Container>
    )
}

export default Register