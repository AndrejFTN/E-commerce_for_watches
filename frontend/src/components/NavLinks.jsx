import { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Box, Typography, Menu, MenuItem } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getFilterOptions } from '../api/watchApi'

const LINKS = [
    { label: 'Početna',  to: '/' },
    { label: 'Muški',    to: '/?gender=muski' },
    { label: 'Ženski',   to: '/?gender=zenski' },
    { label: 'Sniženja', to: '/?onSale=true' },
    { label: 'Novo',     to: '/?sortBy=createdAt&sortDir=desc' },
    { label: 'Kontakt',  to: '/contact' },
]

function NavLinks() {
    const { pathname, search } = useLocation()
    const current = pathname + search                  // npr. "/?gender=muski"
    const [brands, setBrands] = useState([])
    const [anchor, setAnchor] = useState(null)

    useEffect(() => {                                  // brendovi se pune sami iz baze
        getFilterOptions().then(r => setBrands(r.data.brands ?? [])).catch(() => {})
    }, [])


    const scrollToCatalog = (to) => {
        if (!to.startsWith('/?')) return                // "Početna" i "Kontakt" se ne spuštaju
        setTimeout(() => {                              // sačekaj da se lista prerenderuje
            document.getElementById('katalog')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
    }

    const itemSx = (active) => ({
        textDecoration: 'none',
        color: active ? 'text.primary' : 'text.secondary',
        letterSpacing: '0.15em',
        fontSize: 12,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        pb: 0.5,
        borderBottom: 2,                               // podvlačenje označava gde si
        borderColor: active ? 'secondary.main' : 'transparent',//borderColor: active ? 'text.primary' : 'transparent',
        '&:hover': { color: 'text.primary' },
    })

    return (
        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center',
                gap: 4, py: 1.25, flexWrap: 'wrap' }}>

                {LINKS.map(l => (
                    <Typography key={l.to} component={RouterLink} to={l.to}
                                onClick={() => scrollToCatalog(l.to)}
                                variant="overline" sx={itemSx(current === l.to)}>
                        {l.label}
                    </Typography>
                ))}

                {brands.length > 0 && (
                    <>
                        <Typography variant="overline"
                                    onClick={(e) => setAnchor(e.currentTarget)}
                                    sx={{ ...itemSx(search.includes('brand=')),
                                        display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            Brendovi <ExpandMoreIcon sx={{ fontSize: 16 }} />
                        </Typography>

                        <Menu anchorEl={anchor} open={Boolean(anchor)}
                              onClose={() => setAnchor(null)}
                              slotProps={{ paper: { sx: { borderRadius: 2, mt: 1,
                                          border: 1, borderColor: 'divider' } } }}>
                            {brands.map(b => (
                                <MenuItem key={b} component={RouterLink}
                                          to={`/?brand=${encodeURIComponent(b)}`}
                                          onClick={() => { setAnchor(null); scrollToCatalog('/?') }}
                                          sx={{ fontSize: 13 }}>
                                    {b}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default NavLinks