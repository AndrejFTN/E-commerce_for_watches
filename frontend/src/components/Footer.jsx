import { Box, Container, Typography, Divider, IconButton } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'

function FooterLink({ to, children }) {                    // interni link, isti stil svuda
    return (
        <Typography component={RouterLink} to={to} variant="body2"
                    sx={{ display: 'block', mb: 1.2, textDecoration: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        '&:hover': { color: '#fff' } }}>
            {children}
        </Typography>
    )
}

function ColumnTitle({ children }) {
    return (
        <Typography variant="overline"
                    sx={{ color: '#fff', letterSpacing: '0.18em', display: 'block', mb: 2 }}>
            {children}
        </Typography>
    )
}

function ContactRow({ icon, children }) {                  // ikonica + tekst u istom redu
    return (
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ color: 'rgba(255,255,255,0.4)', display: 'flex', mt: '2px' }}>{icon}</Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{children}</Typography>
        </Box>
    )
}

function Footer() {
    return (
        <Box component="footer"
             sx={{ bgcolor: '#0B0B0C', color: 'rgba(255,255,255,0.6)', pt: 8, pb: 4, mt: 10 }}>
            <Container>
                <Box sx={{ display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.6fr 1fr 1fr 2.6fr' },
                    gap: 5 }}>

                    <Box>
                        <Typography variant="h5" sx={{ color: '#fff', letterSpacing: '0.15em', mb: 2 }}>
                            INVICTUS
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 300 }}>
                            Pažljivo biran izbor mehaničkih i kvarcnih satova.
                            Originalni modeli, garancija i dostava širom Srbije.
                        </Typography>

                        <Box sx={{ mt: 3, ml: -1 }}>
                            {[FacebookIcon, InstagramIcon, YouTubeIcon].map((Icon, i) => (
                                <IconButton key={i} href="#" size="small"
                                            sx={{ color: 'rgba(255,255,255,0.5)',
                                                '&:hover': { color: '#fff' } }}>
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Box>

                    <Box>
                        <ColumnTitle>Kupovina</ColumnTitle>
                        <FooterLink to="/">Katalog</FooterLink>
                        <FooterLink to="/favorites">Omiljeno</FooterLink>
                        <FooterLink to="/orders">Moje porudžbine</FooterLink>
                    </Box>

                    <Box>
                        <ColumnTitle>Podrška</ColumnTitle>
                        <FooterLink to="/contact">Kontakt</FooterLink>
                        <FooterLink to="/informacije">Dostava i plaćanje</FooterLink>
                        <FooterLink to="/informacije">Reklamacije</FooterLink>
                    </Box>

                    <Box>
                        <ColumnTitle>Kontakt</ColumnTitle>

                        <Box sx={{ display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },   // podaci | mapa
                            gap: 2.5, alignItems: 'stretch' }}>

                            <Box>
                                <ContactRow icon={<LocationOnOutlinedIcon fontSize="small" />}>
                                    Knez Mihailova 42<br />11000 Beograd
                                </ContactRow>
                                <ContactRow icon={<PhoneOutlinedIcon fontSize="small" />}>
                                    +381 11 4025 180
                                </ContactRow>
                                <ContactRow icon={<EmailOutlinedIcon fontSize="small" />}>
                                    podrska@invictus.rs
                                </ContactRow>
                            </Box>

                            <Box
                                component="iframe"
                                title="Lokacija prodavnice"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.138609157606!2d20.453395811702567!3d44.81874077615232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7aae8ee53333%3A0x7ccedf5c4e88c9da!2sMajstor%20i%20Margarita!5e0!3m2!1sen!2srs!4v1787331778343!5m2!1sen!2srs"
                                sx={{ width: '100%', height: 160, minWidth: 180,
                                    border: 1, borderColor: 'rgba(255,255,255,0.15)' }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.12)' }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Typography variant="overline"
                                sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em' }}>
                        Načini plaćanja
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {['VISA', 'MASTERCARD', 'MAESTRO', 'AMEX'].map(card => (
                            <Box key={card}
                                 sx={{ px: 1.25, py: 0.4, border: 1,
                                     borderColor: 'rgba(255,255,255,0.22)',
                                     fontSize: 10, letterSpacing: '0.1em',
                                     color: 'rgba(255,255,255,0.65)' }}>
                                {card}
                            </Box>
                        ))}
                    </Box>

                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)' }}>
                        Plaćanje obezbeđuje Stripe
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        © {new Date().getFullYear()} Invictus. Sva prava zadržana.
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        Radno vreme: pon–pet 09–20h · sub 10–15h
                    </Typography>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer