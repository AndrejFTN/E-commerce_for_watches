import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, Button, CircularProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined'
import { verifyEmail } from '../api/userApi'
import { useAuth } from '../context/AuthContext'

function VerifyEmail() {
    const [params] = useSearchParams()
    const { isLoggedIn } = useAuth()
    const token = params.get('token')

    const [state, setState] = useState('loading')
    const [message, setMessage] = useState('')
    const done = useRef(false)

    useEffect(() => {
        if (done.current) return
        done.current = true

        if (!token) {
            setState('error')
            setMessage('Link nema token.')
            return
        }

        verifyEmail(token)
            .then(() => setState('ok'))
            .catch(err => {
                setState('error')
                setMessage(err.response?.data?.message || 'Link je istekao ili je već iskorišćen.')
            })
    }, [token])

    if (state === 'loading') {
        return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>
    }

    const ok = state === 'ok'

    return (
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
            {ok
                ? <CheckCircleOutlineIcon sx={{ fontSize: 56, mb: 2 }} />
                : <ErrorOutlineIcon sx={{ fontSize: 56, mb: 2 }} />}

            <Typography variant="h4" sx={{ mb: 1.5 }}>
                {ok ? 'Nalog je verifikovan' : 'Verifikacija nije uspela'}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
                {ok
                    ? 'Sada možeš da poručuješ. Prijavi se i nastavi kupovinu.'
                    : message}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button component={RouterLink} to={ok ? '/login' : '/profile'} variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>
                    {ok ? 'Prijavi se' : 'Pošalji novi link'}
                </Button>
                <Button component={RouterLink} to="/" sx={{ color: 'text.secondary' }}>
                    Nazad na katalog
                </Button>
            </Box>
        </Container>
    )
}

export default VerifyEmail