import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, Button } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined'
import { useCart } from '../context/CartContext'

function OrderSuccess() {
    const { reload } = useCart()

    useEffect(() => { reload() }, [])

    return (
        <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 56, mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 1.5 }}>Plaćanje je uspelo</Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Porudžbina je potvrđena i poslali smo ti mejl sa detaljima.
                Status možeš pratiti u svom nalogu.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button component={RouterLink} to="/orders" variant="contained"
                        sx={{ borderRadius: '999px', px: 4 }}>Moje porudžbine</Button>
                <Button component={RouterLink} to="/" sx={{ color: 'text.secondary' }}>
                    Nazad na katalog
                </Button>
            </Box>
        </Container>
    )
}

export default OrderSuccess