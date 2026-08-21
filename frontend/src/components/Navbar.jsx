import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
    AppBar, Toolbar, Box, InputBase, IconButton, Badge, Menu, MenuItem, Typography, Divider,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import { useCart } from '../context/CartContext'

function Navbar({ onCartClick }) {
    const { count } = useCart()                                   // broj stavki iz konteksta
    const navigate = useNavigate()
    const [term, setTerm] = useState('')
    const [anchor, setAnchor] = useState(null)

    const submitSearch = (e) => {
        e.preventDefault()
        navigate(`/?search=${encodeURIComponent(term)}`)            // pretraga ide u URL, Home je odatle čita
    }

    return (
        <AppBar position="sticky" color="transparent"
                sx={{ bgcolor: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: 1, borderColor: 'divider' }}>
            <Toolbar sx={{ gap: 3, py: 1 }}>

                <Typography component={RouterLink} to="/" variant="h5"
                            sx={{ textDecoration: 'none', color: 'text.primary', letterSpacing: '0.15em' }}>
                    INVICTUS
                </Typography>

                <Box component="form" onSubmit={submitSearch}
                     sx={{ flexGrow: 1, maxWidth: 420, display: 'flex', alignItems: 'center',
                         border: 1, borderColor: 'divider', px: 1.5, py: 0.5 }}>
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                    <InputBase placeholder="Pretraga po brendu ili modelu…" fullWidth
                               value={term} onChange={(e) => setTerm(e.target.value)}
                               sx={{ fontSize: 14 }} />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton component={RouterLink} to="/favorites"><FavoriteBorderIcon /></IconButton>

                <IconButton onClick={onCartClick}>
                    <Badge badgeContent={count} color="primary">
                        <ShoppingBagOutlinedIcon />
                    </Badge>
                </IconButton>

                <IconButton onClick={(e) => setAnchor(e.currentTarget)}><PersonOutlineIcon /></IconButton>
                <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                    <MenuItem component={RouterLink} to="/login" onClick={() => setAnchor(null)}>Prijava</MenuItem>
                    <MenuItem component={RouterLink} to="/register" onClick={() => setAnchor(null)}>Registracija</MenuItem>
                    <Divider />
                    <MenuItem component={RouterLink} to="/orders" onClick={() => setAnchor(null)}>Moje porudžbine</MenuItem>
                    <MenuItem component={RouterLink} to="/profile" onClick={() => setAnchor(null)}>Profil</MenuItem>
                </Menu>

            </Toolbar>
        </AppBar>
    )
}

export default Navbar