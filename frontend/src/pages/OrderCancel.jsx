import { Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined'

function OrderCancel() {
  return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <ErrorOutlineIcon sx={{ fontSize: 56, mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 1.5 }}>Plaćanje je prekinuto</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Porudžbina je sačuvana i čeka plaćanje 30 minuta.
          Ako je ne platiš, biće automatski otkazana, a roba vraćena na stanje.
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

export default OrderCancel