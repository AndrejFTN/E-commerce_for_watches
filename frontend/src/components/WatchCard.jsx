import { useState } from 'react'
import { Card, CardActionArea, CardContent, Typography, Box, Chip, Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { imageUrl } from '../api/watchApi.js'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)

const norm = (s) => (s ?? '').toLowerCase()
    .replaceAll('š', 's').replaceAll('đ', 'dj')
    .replaceAll('č', 'c').replaceAll('ć', 'c').replaceAll('ž', 'z')

const COLOR_HEX = {
    crna: '#111111',      bela: '#FFFFFF',      siva: '#8A8A8A',
    srebrna: '#C0C0C0',   zlatna: '#D4AF37',    braon: '#6B4A2F',
    plava: '#1E4E8C',     teget: '#1B2A4A',     zelena: '#2E6B4F',
    crvena: '#B3262A',    roze: '#E8A0B0',      zuta: '#E3B505',
    ljubicasta: '#6B4C9A', narandzasta: '#E07B39', bez: '#E8DCC8',
}

const OCCASION_LABELS = {
    sportski: 'Sportski', elegantni: 'Elegantni',
    svakodnevni: 'Svakodnevni', poslovni: 'Poslovni',
}

function WatchCard({ watch }) {
    const navigate = useNavigate()
    const { addToCart, items } = useCart()
    const { showToast } = useToast()
    const { isFavorite, toggleFavorite } = useFavorites()
    const fav = isFavorite(watch.watchID)
    const soldOut = watch.stock === 0

    const toggleFav = async (e) => {
        e.stopPropagation()

        if (!localStorage.getItem('token')) {
            navigate('/login')
            return
        }

        try {
            const nowFav = await toggleFavorite(watch.watchID)
            showToast(nowFav ? 'Sačuvano među omiljene' : 'Uklonjeno iz omiljenih',
                nowFav ? 'success' : 'info')
        } catch (err) {
            showToast(err.response?.data?.message || 'Greška pri izmeni', 'error')
        }
    }

    const handleAddToCart = () => {
        const inCart = items.find(i => i.watchID === watch.watchID)?.quantity ?? 0

        if (inCart >= watch.stock) {                   // vec ima maksimum u korpi
            showToast(`Na stanju je samo ${watch.stock} kom.`, 'error')
            return
        }

        addToCart(watch.watchID, 1, watch.stock)
        showToast(`${watch.brand} ${watch.model} — dodato u korpu`)
    }

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>

            <IconButton onClick={toggleFav} size="small"
                        aria-label={fav ? 'Ukloni iz omiljenih' : 'Sačuvaj među omiljene'}
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2,
                            color: fav ? 'text.primary' : 'text.secondary',
                            bgcolor: 'rgba(255,255,255,0.85)',
                            '&:hover': { bgcolor: '#fff', color: 'text.primary' } }}>
                {fav ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>

            <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 1,
                display: 'flex', flexDirection: 'column', gap: 0.75, alignItems: 'flex-start' }}>

                {soldOut && (
                    <Chip label="RASPRODATO" size="small"
                          sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.12em',
                              bgcolor: 'text.primary', color: 'background.paper' }} />
                )}

                {!soldOut && watch.onSale && (
                    <Chip label={`−${watch.discountPercentage}%`} size="small" color="secondary"
                          sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.12em' }} />
                )}

                {!soldOut && watch.newArrival && (
                    <Chip label="NOVO" size="small"
                          sx={{ borderRadius: 0, height: 22, fontSize: 10, letterSpacing: '0.12em',
                              bgcolor: 'transparent', color: 'secondary.main',
                              border: 1, borderColor: 'secondary.main' }} />
                )}
            </Box>

            <CardActionArea onClick={() => navigate(`/watch/${watch.watchID}`)}>
                <Box sx={{ aspectRatio: '1 / 1', p: 3, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    opacity: soldOut ? 0.45 : 1 }}>
                    {watch.primaryImageID ? (
                        <Box component="img" src={imageUrl(watch.primaryImageID)} alt={`${watch.brand} ${watch.model}`}
                             sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                        <Typography variant="body2" color="text.secondary">bez slike</Typography>
                    )}
                </Box>

                <CardContent sx={{ pt: 0 }}>
                    <Typography variant="overline" sx={{ letterSpacing: '0.18em', fontSize: 11, color: 'text.primary' }}>
                        {watch.brand}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>{watch.model}</Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', flexWrap: 'nowrap' }}>
                        {watch.onSale ? (
                            <>
                                <Typography color="text.secondary"
                                            sx={{ textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
                                    {fmt(watch.price)} €
                                </Typography>
                                <Typography color="secondary.main" fontWeight={500}
                                            sx={{ whiteSpace: 'nowrap' }}>
                                    {fmt(watch.effectivePrice)} €
                                </Typography>
                            </>
                        ) : (
                            <Typography fontWeight={500} sx={{ whiteSpace: 'nowrap' }}>
                                {fmt(watch.price)} €
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                        <Box sx={{ width: 11, height: 11, borderRadius: '50%', flexShrink: 0,
                            bgcolor: COLOR_HEX[norm(watch.color)] ?? 'transparent',
                            border: 1, borderColor: 'divider' }} />
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {watch.color}
                            {watch.occasion && ` · ${OCCASION_LABELS[watch.occasion] ?? watch.occasion}`}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>

            <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                <Button fullWidth variant="outlined" disabled={soldOut}
                        onClick={handleAddToCart}
                        sx={{ borderRadius: '999px', py: 1.1,
                            borderColor: 'text.primary', borderWidth: 1.5, color: 'text.primary',
                            '&:hover': { borderWidth: 1.5, bgcolor: 'text.primary',
                                color: 'background.paper' } }}>
                    {soldOut ? 'Rasprodato' : 'Dodaj u korpu'}
                </Button>
            </Box>
        </Card>
    )
}

export default WatchCard