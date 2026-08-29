import { useEffect, useState } from 'react'
import { Box, Typography, Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const SLIDES = [
    {
        image: '/banners/1.jpg',
        title: 'Nova kolekcija',
        subtitle: 'Pažljivo biran izbor mehaničkih i kvarcnih satova',
        cta: 'Pogledaj ponudu',
        link: '#katalog',
    },
    {
        image: '/banners/2.jpg',
        title: 'Besplatna dostava',
        subtitle: 'Za porudžbine od dva ili više komada',
        cta: 'Uslovi dostave',
        link: '/contact',
    },
    {
        image: '/banners/3.jpg',
        title: 'Sniženja u toku',
        subtitle: 'Izabrani modeli po sniženim cenama, dok traju zalihe',
        cta: 'Pogledaj sniženja',
        link: '/?onSale=true',
    },
]

const INTERVAL = 6000

function HeroSlider() {
    const navigate = useNavigate()
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        if (paused) return
        const id = setInterval(() => {
            setIndex(i => (i + 1) % SLIDES.length)
        }, INTERVAL)
        return () => clearInterval(id)
    }, [paused])

    const go = (dir) => setIndex(i => (i + dir + SLIDES.length) % SLIDES.length)


    const scrollToCatalog = () => {
        document.getElementById('katalog')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const handleCta = (link) => {
        if (link.startsWith('#')) {
            scrollToCatalog()
            return
        }

        navigate(link)

        if (link.startsWith('/?')) {
            setTimeout(scrollToCatalog, 100)
        }
    }


    return (
        <Box
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            sx={{ position: 'relative', width: '100%',
                height: { xs: 260, md: 380 }, overflow: 'hidden', bgcolor: '#0B0B0C' }}
        >
            {SLIDES.map((slide, i) => (
                <Box key={i} sx={{
                    position: 'absolute', inset: 0,
                    opacity: i === index ? 1 : 0,
                    transition: 'opacity 700ms ease',
                    pointerEvents: i === index ? 'auto' : 'none',
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <Box sx={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)',
                    }} />

                    <Box sx={{ position: 'relative', height: '100%',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        px: { xs: 4, md: 10 }, maxWidth: 640 }}>
                        <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 34, md: 54 }, mb: 1.5 }}>
                            {slide.title}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, fontSize: { xs: 14, md: 16 } }}>
                            {slide.subtitle}
                        </Typography>
                        <Button variant="contained" onClick={() => handleCta(slide.link)}
                                sx={{ alignSelf: 'flex-start', borderRadius: '999px', px: 4, py: 1.2,
                                    bgcolor: '#fff', color: 'text.primary',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.85)' } }}>
                            {slide.cta}
                        </Button>
                    </Box>
                </Box>
            ))}

            <IconButton onClick={() => go(-1)}
                        sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                            color: '#fff', bgcolor: 'rgba(0,0,0,0.25)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' } }}>
                <ChevronLeftIcon />
            </IconButton>

            <IconButton onClick={() => go(1)}
                        sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                            color: '#fff', bgcolor: 'rgba(0,0,0,0.25)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' } }}>
                <ChevronRightIcon />
            </IconButton>

            <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 1 }}>
                {SLIDES.map((_, i) => (
                    <Box key={i} onClick={() => setIndex(i)}
                         sx={{ width: i === index ? 24 : 8, height: 8, borderRadius: '999px',
                             bgcolor: i === index ? '#fff' : 'rgba(255,255,255,0.45)',
                             cursor: 'pointer', transition: 'all 300ms ease' }} />
                ))}
            </Box>
        </Box>
    )
}

export default HeroSlider