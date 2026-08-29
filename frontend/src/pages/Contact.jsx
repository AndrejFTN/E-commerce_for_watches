import { useState } from 'react'
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { sendRequest } from '../api/requestApi'
import { useToast } from '../context/ToastContext'

const EMPTY = { name: '', email: '', subject: '', text: '' }

function Row({ icon, children }) {
    return (
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ color: 'text.secondary', display: 'flex', mt: '2px' }}>{icon}</Box>
            <Typography variant="body2" color="text.secondary">{children}</Typography>
        </Box>
    )
}

function Contact() {
    const { showToast } = useToast()
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)

    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setBusy(true)
        setError(null)
        try {
            await sendRequest(form)
            setForm(EMPTY)
            showToast('Poruka je poslata — javićemo se uskoro')
        } catch (err) {
            setError(err.response?.data?.message || 'Slanje nije uspelo')
        } finally {
            setBusy(false)
        }
    }

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Kontakt</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
                Pitanja o modelima, dostupnosti ili porudžbini — javi se, odgovaramo u toku radnog dana.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>

                <Box component="form" onSubmit={submit}>
                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>{error}</Alert>}

                    <TextField name="name" label="Ime i prezime" fullWidth required
                               value={form.name} onChange={change} sx={{ mb: 2 }} />
                    <TextField name="email" label="Email" type="email" fullWidth required
                               value={form.email} onChange={change} sx={{ mb: 2 }} />
                    <TextField name="subject" label="Naslov" fullWidth required
                               value={form.subject} onChange={change} sx={{ mb: 2 }}
                               slotProps={{ htmlInput: { maxLength: 100 } }} />
                    <TextField name="text" label="Poruka" fullWidth required multiline rows={6}
                               value={form.text} onChange={change} sx={{ mb: 1 }}
                               slotProps={{ htmlInput: { maxLength: 1000 } }}
                               helperText={`${form.text.length} / 1000`} />

                    <Button type="submit" variant="contained" disabled={busy}
                            sx={{ mt: 2, px: 4, py: 1.2, borderRadius: '999px' }}>
                        {busy ? 'Slanje…' : 'Pošalji poruku'}
                    </Button>
                </Box>

                <Box>
                    <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 2 }}>
                        Prodavnica
                    </Typography>

                    <Row icon={<LocationOnOutlinedIcon fontSize="small" />}>
                        Knez Mihailova 42<br />11000 Beograd
                    </Row>
                    <Row icon={<PhoneOutlinedIcon fontSize="small" />}>+381 11 4025 180</Row>
                    <Row icon={<EmailOutlinedIcon fontSize="small" />}>podrska@invictus.rs</Row>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Radno vreme: pon–pet 09–20h · sub 10–15h
                    </Typography>

                    <Box component="iframe"
                         title="Lokacija prodavnice"
                         loading="lazy"
                         referrerPolicy="no-referrer-when-downgrade"
                         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.138609157606!2d20.453395811702567!3d44.81874077615232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7aae8ee53333%3A0x7ccedf5c4e88c9da!2sMajstor%20i%20Margarita!5e0!3m2!1sen!2srs!4v1787331778343!5m2!1sen!2srs"
                         sx={{ width: '100%', height: 300, border: 1, borderColor: 'divider' }} />
                </Box>
            </Box>
        </Container>
    )
}

export default Contact