import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    Container, Box, Typography, TextField, Button, Alert, Chip, CircularProgress, Paper,
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getMyInfo, updateMyProfile, resetPassword, resendEmail } from '../api/userApi'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

function Field({ label, value }) {
    return (
        <Box sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary"
                        sx={{ display: 'block', letterSpacing: '0.04em' }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.25 }}>
                {value || '—'}
            </Typography>
        </Box>
    )
}

function Card({ title, children }) {
    return (
        <Paper sx={{ border: 1, borderColor: 'divider', p: 3 }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 2 }}>
                {title}
            </Typography>
            {children}
        </Paper>
    )
}

const EMPTY_PASS = { oldPassword: '', newPassword: '', confirmNewPassword: '' }

function Profile() {
    const { isLoggedIn, username } = useAuth()
    const { showToast } = useToast()

    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)

    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ fullName: '', phone: '' })
    const [formErr, setFormErr] = useState(null)

    const [changing, setChanging] = useState(false)
    const [pass, setPass] = useState(EMPTY_PASS)
    const [passErr, setPassErr] = useState(null)

    useEffect(() => {
        if (!isLoggedIn || !username) { setLoading(false); return }
        getMyInfo()
            .then(r => setInfo(r.data))
            .catch(err => showToast(`Greška ${err.response?.status ?? ''}: ${err.response?.data?.message ?? err.message}`, 'error'))
            .finally(() => setLoading(false))
    }, [isLoggedIn, username])

    const startEdit = () => {
        setForm({ fullName: info?.fullName ?? '', phone: info?.phone ?? '' })
        setFormErr(null)
        setEditing(true)
    }

    const saveProfile = async (e) => {
        e.preventDefault()
        setBusy(true); setFormErr(null)
        try {
            const r = await updateMyProfile(form)
            setInfo(r.data)
            setEditing(false)
            showToast('Podaci su sačuvani')
        } catch (err) {
            setFormErr(err.response?.data?.message || 'Čuvanje nije uspelo')
        } finally { setBusy(false) }
    }

    const changePassword = async (e) => {
        e.preventDefault()
        if (pass.newPassword !== pass.confirmNewPassword) {
            setPassErr('Nove lozinke se ne poklapaju')
            return
        }
        setBusy(true); setPassErr(null)
        try {
            await resetPassword(pass)
            setPass(EMPTY_PASS)
            setChanging(false)
            showToast('Lozinka je promenjena — prijavi se ponovo')
        } catch (err) {
            setPassErr(err.response?.data?.message || 'Promena lozinke nije uspela')
        } finally { setBusy(false) }
    }

    const resend = async () => {
        try {
            await resendEmail(info.email)
            showToast('Verifikacioni mejl je ponovo poslat')
        } catch (err) {
            showToast(err.response?.data?.message || 'Slanje nije uspelo', 'error')
        }
    }

    if (!isLoggedIn) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ mb: 2 }}>Profil</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>Prijavi se da bi video svoj nalog.</Typography>
                <Button component={RouterLink} to="/login" variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>Prijavi se</Button>
            </Container>
        )
    }

    if (loading) return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>

    const outlined = {
        borderRadius: '999px', px: 3, py: 0.8, fontSize: 11,
        borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
        '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary', color: 'background.paper' },
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="h4">Profil</Typography>
                <Chip size="small"
                      icon={info?.verified
                          ? <CheckIcon sx={{ fontSize: 14 }} />
                          : <CloseIcon sx={{ fontSize: 14 }} />}
                      label={info?.verified ? 'Verifikovan' : 'Nije verifikovan'}
                      sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.1em',
                          bgcolor: info?.verified ? 'text.primary' : 'transparent',
                          color: info?.verified ? 'background.paper' : 'text.primary',
                          border: 1, borderColor: 'text.primary',
                          '& .MuiChip-icon': { color: 'inherit', ml: 0.75 } }} />

                {!info?.verified && (
                    <Button size="small" onClick={resend} sx={{ fontSize: 11, ml: 'auto' }}>
                        Pošalji verifikacioni mejl
                    </Button>
                )}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }, gap: 3 }}>

                <Card title="Lični podaci">
                    {!editing ? (
                        <>
                            <Field label="Korisničko ime" value={info?.userName} />
                            <Field label="Email" value={info?.email} />
                            <Field label="Ime i prezime" value={info?.fullName} />
                            <Field label="Telefon" value={info?.phone} />

                            <Button variant="outlined" onClick={startEdit} sx={{ ...outlined, mt: 2.5 }}>
                                Izmeni podatke
                            </Button>
                        </>
                    ) : (
                        <Box component="form" onSubmit={saveProfile}>
                            {formErr && <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{formErr}</Alert>}

                            <TextField label="Ime i prezime" size="small" fullWidth required sx={{ mb: 2 }}
                                       value={form.fullName}
                                       onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                            <TextField label="Telefon" size="small" fullWidth required sx={{ mb: 1 }}
                                       value={form.phone}
                                       onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />

                            <Typography variant="caption" color="text.secondary">
                                Korisničko ime i email se ne mogu menjati.
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                                <Button type="submit" variant="contained" disabled={busy}
                                        sx={{ borderRadius: '999px', px: 3, py: 0.8, fontSize: 11 }}>
                                    Sačuvaj
                                </Button>
                                <Button onClick={() => setEditing(false)}
                                        sx={{ fontSize: 11, color: 'text.secondary' }}>
                                    Odustani
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Card>

                <Card title="Bezbednost">
                    {!changing ? (
                        <>
                            <Field label="Lozinka" value="••••••••" />
                            <Typography variant="caption" color="text.secondary"
                                        sx={{ display: 'block', mt: 2 }}>
                                Posle promene lozinke bićeš odjavljen sa svih uređaja.
                            </Typography>
                            <Button variant="outlined" onClick={() => setChanging(true)}
                                    sx={{ ...outlined, mt: 2 }}>
                                Promeni lozinku
                            </Button>
                        </>
                    ) : (
                        <Box component="form" onSubmit={changePassword}>
                            {passErr && <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{passErr}</Alert>}

                            <TextField label="Trenutna lozinka" type="password" size="small" fullWidth required sx={{ mb: 2 }}
                                       value={pass.oldPassword}
                                       onChange={e => setPass(p => ({ ...p, oldPassword: e.target.value }))} />
                            <TextField label="Nova lozinka" type="password" size="small" fullWidth required sx={{ mb: 2 }}
                                       value={pass.newPassword}
                                       onChange={e => setPass(p => ({ ...p, newPassword: e.target.value }))}
                                       helperText="Min. 8 karaktera, veliko i malo slovo i cifra" />
                            <TextField label="Potvrdi novu" type="password" size="small" fullWidth required sx={{ mb: 2 }}
                                       value={pass.confirmNewPassword}
                                       onChange={e => setPass(p => ({ ...p, confirmNewPassword: e.target.value }))} />

                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button type="submit" variant="contained" disabled={busy}
                                        sx={{ borderRadius: '999px', px: 3, py: 0.8, fontSize: 11 }}>
                                    Sačuvaj
                                </Button>
                                <Button onClick={() => { setChanging(false); setPass(EMPTY_PASS) }}
                                        sx={{ fontSize: 11, color: 'text.secondary' }}>
                                    Odustani
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Card>
            </Box>
        </Container>
    )
}

export default Profile