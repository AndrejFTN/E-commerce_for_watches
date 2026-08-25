import { Link as RouterLink } from 'react-router-dom'
import { Container, Box, Typography, Divider, Button } from '@mui/material'

function Section({ title, children }) {
    return (
        <Box sx={{ mb: 5 }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.15em', display: 'block', mb: 1.5 }}>
                {title}
            </Typography>
            {children}
        </Box>
    )
}

function P({ children }) {
    return (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9, mb: 1.5 }}>
            {children}
        </Typography>
    )
}

function Info() {
    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>Dostava, plaćanje i reklamacije</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
                Sve što treba da znaš pre i posle kupovine.
            </Typography>

            <Section title="Dostava">
                <P>
                    Dostava se naplaćuje <strong>20 €</strong> po porudžbini. Za porudžbine
                    od <strong>dva ili više komada</strong> dostava je besplatna.
                </P>
                <P>
                    Isporučujemo na teritoriji Srbije, kurirskom službom, radnim danima.
                    Rok isporuke je 2–5 radnih dana od potvrde plaćanja.
                </P>
                <P>
                    Trošak dostave se prikazuje u korpi i u pregledu porudžbine pre plaćanja,
                    tako da nema naknadnih iznenađenja.
                </P>
            </Section>

            <Divider sx={{ mb: 5 }} />

            <Section title="Plaćanje">
                <P>
                    Plaćanje se obavlja <strong>karticom</strong>, na zaštićenoj stranici servisa
                    Stripe. Prihvatamo Visa, Mastercard, Maestro i American Express kartice.
                </P>
                <P>
                    Podaci o kartici <strong>nikada ne prolaze kroz našu prodavnicu</strong> —
                    unosiš ih direktno kod Stripe-a, koji obaveštava našu prodavnicu samo o tome
                    da li je plaćanje uspelo.
                </P>
                <P>
                    Kada napraviš porudžbinu, roba se odmah rezerviše i skida sa stanja.
                    Porudžbina čeka plaćanje <strong>30 minuta</strong>; ako u tom roku ne bude
                    plaćena, automatski se otkazuje a roba vraća na stanje.
                </P>
                <P>
                    Za kupovinu je potrebno da nalog bude verifikovan — link za potvrdu stiže
                    na mejl odmah po registraciji.
                </P>
            </Section>

            <Divider sx={{ mb: 5 }} />

            <Section title="Reklamacije">
                <P>
                    Reklamacije i zahteve za zamenu trenutno primamo preko kontakt forme.
                    U poruci navedi <strong>broj porudžbine</strong>, model sata i kratak opis problema.
                </P>
                <P>
                    Na svaku reklamaciju odgovaramo u roku od 8 dana od prijema.
                    Za satove u garantnom roku važe uslovi proizvođača navedeni u garantnom listu.
                </P>

                <Button component={RouterLink} to="/contact" variant="outlined"
                        sx={{ mt: 1, borderRadius: '999px', px: 4, py: 1,
                            borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
                            '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary', color: 'background.paper' } }}>
                    Pošalji reklamaciju
                </Button>
            </Section>
        </Container>
    )
}

export default Info