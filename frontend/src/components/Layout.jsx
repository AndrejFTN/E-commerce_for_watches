import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import Navbar from './Navbar'

function Layout() {
    const [cartOpen, setCartOpen] = useState(false)               // drawer dodajemo u sledećem koraku

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onCartClick={() => setCartOpen(true)} />

            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 4, mt: 8 }}>
                <Container>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} Invictus — prodavnica satova
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}

export default Layout