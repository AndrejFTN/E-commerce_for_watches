import { useState, useEffect } from 'react'
import NavLinks from './NavLinks'
import { useNavigate, useSearchParams, useLocation, Link as RouterLink } from 'react-router-dom'
import {
    AppBar, Toolbar, Box, InputBase, IconButton, Badge, Menu, MenuItem, Typography, Divider, Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import { useCart } from '../context/CartContext'

function Navbar({ onCartClick }) {
    const { count } = useCart()                                   // broj stavki iz konteksta
    const navigate = useNavigate()
    const [params] = useSearchParams()                            // trenutna pretraga iz URL-a
    const [term, setTerm] = useState(params.get('search') ?? '')
    const [anchor, setAnchor] = useState(null)

    useEffect(() => {                                             // URL se promenio (čip obrisan, "Poništi sve")
        setTerm(params.get('search') ?? '')                       // → polje se samo uskladi
    }, [params])

    const submitSearch = (e) => {
        e.preventDefault()
        const q = term.trim()
        navigate(q ? `/?search=${encodeURIComponent(q)}` : '/')   // prazno polje → vrati sve satove
    }

    useLocation()                                             // privremeno: da se traka osveži posle
    const isLoggedIn = Boolean(localStorage.getItem('token')) // prijave/odjave; zameniće AuthContext

    const handleLogout = () => {
        localStorage.removeItem('token')
        setAnchor(null)
        navigate('/')
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
                         border: 1, borderColor: 'divider', pl: 1.5, pr: 0.5, py: 0.25 }}>
                    <InputBase placeholder="Pretraga po brendu ili modelu…" fullWidth
                               value={term} onChange={(e) => setTerm(e.target.value)}
                               sx={{ fontSize: 14 }} />
                    <IconButton type="submit" size="small" aria-label="Pretraži">
                        <SearchIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <IconButton component={RouterLink} to="/favorites"><FavoriteBorderIcon /></IconButton>

                <IconButton onClick={onCartClick}>
                    <Badge badgeContent={count} color="primary">
                        <ShoppingBagOutlinedIcon />
                    </Badge>
                </IconButton>

                {!isLoggedIn ? (
                    <Button component={RouterLink} to="/login" variant="outlined" size="small"
                            sx={{ borderRadius: '999px', px: 2.5, py: 0.6, fontSize: 11,
                                borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
                                '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary', color: 'background.paper' } }}>
                        Prijava
                    </Button>
                ) : (
                    <>
                        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                            <PersonOutlineIcon />
                        </IconButton>
                        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
                              slotProps={{ paper: { sx: { borderRadius: 2, mt: 1,
                                          border: 1, borderColor: 'divider' } } }}>
                            <MenuItem component={RouterLink} to="/profile" onClick={() => setAnchor(null)}>Profil</MenuItem>
                            <MenuItem component={RouterLink} to="/orders" onClick={() => setAnchor(null)}>Moje porudžbine</MenuItem>
                            <MenuItem component={RouterLink} to="/favorites" onClick={() => setAnchor(null)}>Favoriti</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout}>Odjava</MenuItem>
                        </Menu>
                    </>
                )}

            </Toolbar>
            <NavLinks />
        </AppBar>
    )
}

export default Navbar