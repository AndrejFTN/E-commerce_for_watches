import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getActiveSales } from '../api/watchApi'

const INTERVAL = 5000

const fmtDate = (d) =>                                 // "2026-08-25" → "25.08."
    new Date(d).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' })

function AnnouncementBar() {
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const base = [{                                // stalna poruka, ne zavisi od baze
            text: 'Besplatna dostava za porudžbine od dva ili više komada',
            link: null,
        }]

        getActiveSales()
            .then(r => {
                const sales = r.data.map(s => ({
                    text: `${s.brand} ${s.model} — sniženje ${s.discountPercentage}%, do ${fmtDate(s.endDate)}`,
                    link: `/watch/${s.watchID}`,
                }))
                setMessages([...base, ...sales])
            })
            .catch(() => setMessages(base))            // backend pao → bar ostane poruka o dostavi
    }, [])

    useEffect(() => {
        if (messages.length <= 1) return                // jedna poruka → nema šta da se smenjuje
        const id = setInterval(() => {
            setIndex(i => (i + 1) % messages.length)
        }, INTERVAL)
        return () => clearInterval(id)
    }, [messages])

    if (messages.length === 0) return null              // dok se učitava, trake nema

    const current = messages[index]

    return (
        <Box sx={{ bgcolor: '#141416', height: 38, display: 'flex', //<Box sx={{ bgcolor: '#7A6B52', height: 38, display: 'flex',
            alignItems: 'center', justifyContent: 'center', px: 2, overflow: 'hidden' }}>
            {messages.map((m, i) => (
                <Typography
                    key={i}
                    variant="overline"
                    onClick={() => m.link && navigate(m.link)}
                    sx={{
                        position: i === index ? 'static' : 'absolute',
                        opacity: i === index ? 1 : 0,
                        transition: 'opacity 500ms ease',
                        pointerEvents: i === index ? 'auto' : 'none',
                        color: '#C9AE84',//color: 'rgba(255,255,255,0.92)',
                        letterSpacing: '0.15em', fontSize: 11, fontWeight: 500,
                        whiteSpace: 'nowrap',
                        cursor: m.link ? 'pointer' : 'default',
                        '&:hover': { color: m.link ? '#E3CDA6' : undefined },//'&:hover': { color: m.link ? '#fff' : undefined },
                    }}>
                    {m.text}
                </Typography>
            ))}
        </Box>
    )
}

export default AnnouncementBar