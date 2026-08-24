import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'
import AnnouncementBar from './AnnouncementBar'
import CartDrawer from './CartDrawer'
import CartTab from './CartTab'

function Layout() {
    const [cartOpen, setCartOpen] = useState(false)               // drawer korpe dolazi kasnije

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar onCartClick={() => setCartOpen(o => !o)} />
                <AnnouncementBar />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            <Footer />
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
            <CartTab open={cartOpen} onToggle={() => setCartOpen(o => !o)} />
        </Box>
    )
}

export default Layout