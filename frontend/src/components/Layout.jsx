import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'
import AnnouncementBar from './AnnouncementBar'
import CartDrawer from './CartDrawer'
import CartTab from './CartTab'
import ScrollToTop from './ScrollToTop'
import { useCart } from '../context/CartContext'

function Layout() {
    const { drawerOpen, closeDrawer, toggleDrawer } = useCart()
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ScrollToTop />
            <Navbar/>
                <AnnouncementBar />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            <Footer />
            <CartDrawer open={drawerOpen} onClose={closeDrawer} />
            <CartTab open={drawerOpen} onToggle={toggleDrawer} />
        </Box>
    )
}

export default Layout