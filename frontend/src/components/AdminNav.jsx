import { NavLink } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

const LINKS = [
    { to: '/admin',         label: 'Pregled', end: true },
    { to: '/admin/watches', label: 'Satovi' },
    { to: '/admin/orders',  label: 'Porudžbine' },
    { to: '/admin/users',   label: 'Korisnici' },
]

function AdminNav() {
    return (
        <Box sx={{ display: 'flex', gap: 3, mb: 4, borderBottom: 1, borderColor: 'divider' }}>
            {LINKS.map(l => (
                <NavLink key={l.to} to={l.to} end={l.end} style={{ textDecoration: 'none' }}>
                    {({ isActive }) => (
                        <Typography variant="overline"
                                    sx={{ fontSize: 12, letterSpacing: '0.12em', pb: 1.2,
                                        display: 'block',
                                        color: isActive ? 'text.primary' : 'text.secondary',
                                        borderBottom: 2,
                                        borderColor: isActive ? 'text.primary' : 'transparent',
                                        '&:hover': { color: 'text.primary' } }}>
                            {l.label}
                        </Typography>
                    )}
                </NavLink>
            ))}
        </Box>
    )
}

export default AdminNav