import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
    Container, Box, Typography, Button, IconButton, Chip, Divider,
    CircularProgress, Alert, Breadcrumbs,
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { getOneWatch, imageUrl } from '../api/watchApi'
import { useFavorites } from '../context/FavoritesContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { LABELS } from '../labels'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'


const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)

function WatchDetails() {
    const { watchID } = useParams()
    const navigate = useNavigate()
    const { addToCart, items } = useCart()
    const { showToast } = useToast()

    const [watch, setWatch] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeImg, setActiveImg] = useState(null)
    const { isFavorite, toggleFavorite } = useFavorites()
    const [qty, setQty] = useState(1)

    useEffect(() => {
        setLoading(true)
        setError(null)
        getOneWatch(watchID)
            .then(r => {
                setWatch(r.data)
                const imgs = r.data.images ?? []
                const primary = imgs.find(i => i.primary) ?? imgs[0]
                setActiveImg(primary?.imageID ?? null)
            })
            .catch(e => setError(e.response?.status === 404
                ? 'Sat nije pronađen.'
                : e.message))
            .finally(() => setLoading(false))
    }, [watchID])

    if (loading) return <Box sx={{ py: 12, textAlign: 'center' }}><CircularProgress /></Box>
    if (error)   return <Container sx={{ py: 8 }}><Alert severity="error">{error}</Alert></Container>
    if (!watch)  return null

    const soldOut = watch.stock === 0


    const images = watch.images ?? []
    const activeIndex = images.findIndex(i => i.imageID === activeImg)

    const goImg = (dir) => {
        if (images.length < 2) return
        const next = (activeIndex + dir + images.length) % images.length
        setActiveImg(images[next].imageID)
    }
    const inCart = items.find(i => i.watchID === watch.watchID)?.quantity ?? 0
    const canAdd = Math.max(0, watch.stock - inCart)   

    const handleAdd = () => {
        if (canAdd === 0) {
            showToast(`Na stanju je samo ${watch.stock} kom.`, 'error')
            return
        }
        addToCart(watch.watchID, Math.min(qty, canAdd), watch.stock)
        showToast(`${watch.brand} ${watch.model} — dodato u korpu`)
    }

    const fav = isFavorite(watchID)

    const toggleFav = async () => {
        if (!localStorage.getItem('token')) { navigate('/login'); return }
        try {
            const nowFav = await toggleFavorite(watchID)
            showToast(nowFav ? 'Sačuvano među omiljene' : 'Uklonjeno iz omiljenih',
                nowFav ? 'success' : 'info')
        } catch (err) {
            showToast(err.response?.data?.message || 'Greška pri izmeni', 'error')
        }
    }

    const specs = [
        ['Brend', watch.brand],
        ['Model', watch.model],
        ['Mehanizam', watch.mechanism],
        ['Boja', watch.color],
        ['Pol', LABELS[watch.gender] ?? watch.gender],
        ['Prilika', LABELS[watch.occasion] ?? watch.occasion],
        ['Godina proizvodnje', watch.manufactureDate?.slice(0, 4)],
    ].filter(([, v]) => v)                             // prazna polja se ne prikazuju

    return (
        <Container sx={{ py: 5 }}>
            <Breadcrumbs sx={{ mb: 4, fontSize: 13 }}>
                <Typography component={RouterLink} to="/"
                            sx={{ textDecoration: 'none', color: 'text.secondary', fontSize: 13 }}>
                    Katalog
                </Typography>
                <Typography sx={{ fontSize: 13 }}>{watch.brand} {watch.model}</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }, gap: 6 }}>

                <Box>
                    <Box sx={{ position: 'relative', aspectRatio: '1 / 1', border: 1, borderColor: 'divider',
                        bgcolor: 'background.paper', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', p: 4 }}>
                        {activeImg
                            ? <Box component="img" src={imageUrl(activeImg)} alt={watch.model}
                                   sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            : <Typography color="text.secondary">bez slike</Typography>}

                        {images.length > 1 && (
                            <>
                                <IconButton onClick={() => goImg(-1)} size="small"
                                            sx={{ position: 'absolute', left: 12, top: '50%',
                                                transform: 'translateY(-50%)',
                                                bgcolor: 'rgba(255,255,255,0.9)', border: 1, borderColor: 'divider',
                                                '&:hover': { bgcolor: '#fff' } }}>
                                    <ChevronLeftIcon fontSize="small" />
                                </IconButton>

                                <IconButton onClick={() => goImg(1)} size="small"
                                            sx={{ position: 'absolute', right: 12, top: '50%',
                                                transform: 'translateY(-50%)',
                                                bgcolor: 'rgba(255,255,255,0.9)', border: 1, borderColor: 'divider',
                                                '&:hover': { bgcolor: '#fff' } }}>
                                    <ChevronRightIcon fontSize="small" />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    {(watch.images?.length ?? 0) > 1 && (
                        <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                            {watch.images.map(img => (
                                <Box key={img.imageID} onClick={() => setActiveImg(img.imageID)}
                                     sx={{ width: 72, height: 72, p: 0.5, cursor: 'pointer',
                                         border: 1, display: 'flex',
                                         alignItems: 'center', justifyContent: 'center',
                                         borderColor: img.imageID === activeImg ? 'text.primary' : 'divider' }}>
                                    <Box component="img" src={imageUrl(img.imageID)} alt=""
                                         sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {soldOut && <Chip label="RASPRODATO" size="small"
                                          sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.12em',
                                              bgcolor: 'text.primary', color: 'background.paper' }} />}
                        {!soldOut && watch.onSale && <Chip label={`−${watch.discountPercentage}%`} size="small"
                                                           color="secondary"
                                                           sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.12em' }} />}
                        {!soldOut && watch.newArrival && <Chip label="NOVO" size="small"
                                                               sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.12em',
                                                                   bgcolor: 'transparent', color: 'secondary.main',
                                                                   border: 1, borderColor: 'secondary.main' }} />}
                    </Box>

                    <Typography variant="overline" sx={{ letterSpacing: '0.18em', fontSize: 12 }}>
                        {watch.brand}
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 2 }}>{watch.model}</Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline', mb: 3 }}>
                        {watch.onSale ? (
                            <>
                                <Typography color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: 20 }}>
                                    {fmt(watch.price)} €
                                </Typography>
                                <Typography color="secondary.main" sx={{ fontSize: 28, fontWeight: 500 }}>
                                    {fmt(watch.effectivePrice)} €
                                </Typography>
                            </>
                        ) : (
                            <Typography sx={{ fontSize: 28, fontWeight: 500 }}>{fmt(watch.price)} €</Typography>
                        )}
                    </Box>

                    <Typography variant="body2" color={soldOut ? 'error' : 'text.secondary'} sx={{ mb: 3 }}>
                        {soldOut ? 'Trenutno nije dostupan' : `Na stanju: ${watch.stock} kom.`}
                    </Typography>

                    {!soldOut && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center',
                                border: 1, borderColor: 'divider', borderRadius: '999px' }}>
                                <IconButton size="small" disabled={qty <= 1} onClick={() => setQty(q => q - 1)}>
                                    <RemoveIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <Typography sx={{ minWidth: 28, textAlign: 'center' }}>{qty}</Typography>
                                <IconButton size="small" disabled={qty >= canAdd} onClick={() => setQty(q => q + 1)}>
                                    <AddIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>

                            <Button variant="contained" onClick={handleAdd} disabled={canAdd === 0}
                                    sx={{ borderRadius: '999px', px: 4, py: 1.2, flexGrow: 1 }}>
                                {canAdd === 0 ? 'Sve je u korpi' : 'Dodaj u korpu'}
                            </Button>

                            <IconButton onClick={toggleFav}
                                        sx={{ border: 1, borderColor: 'divider',
                                            color: fav ? 'text.primary' : 'text.secondary' }}>
                                {fav ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                            </IconButton>
                        </Box>
                    )}

                    {watch.description && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="body2" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                {watch.description}
                            </Typography>
                        </>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="overline" sx={{ letterSpacing: '0.15em', fontSize: 12 }}>
                        Specifikacija
                    </Typography>
                    <Box sx={{ mt: 1.5 }}>
                        {specs.map(([label, value]) => (
                            <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between',
                                py: 1, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="body2" color="text.secondary">{label}</Typography>
                                <Typography variant="body2">{value}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default WatchDetails