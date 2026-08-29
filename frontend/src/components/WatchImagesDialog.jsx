import { useEffect, useState } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, IconButton,
    Typography, CircularProgress, Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import StarIcon from '@mui/icons-material/StarOutlined'
import { getOneWatch, imageUrl, addWatchImage, deleteWatchImage, setPrimaryImage } from '../api/watchApi'
import { useToast } from '../context/ToastContext'

const MAX_IMAGES = 5

function WatchImagesDialog({ watch, onClose, onChanged }) {
    const { showToast } = useToast()
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [busy, setBusy] = useState(false)

    const load = () => {
        if (!watch) return
        setLoading(true)
        getOneWatch(watch.watchID)
            .then(r => setImages(r.data.images ?? []))
            .catch(() => setImages([]))
            .finally(() => setLoading(false))
    }

    useEffect(load, [watch])

    const guard = (fn) => async (...args) => {
        setBusy(true)
        try {
            await fn(...args)
            load()
            onChanged()
        } catch (err) {
            showToast(err.response?.data?.message || 'Greška', 'error')
        } finally {
            setBusy(false)
        }
    }

    const onUpload = guard(async (e) => {
        const files = Array.from(e.target.files).slice(0, MAX_IMAGES - images.length)
        for (const file of files) {
            await addWatchImage(watch.watchID, file)
        }
        e.target.value = ''
        showToast(`Dodato ${files.length} slika`)
    })

    const onDelete = guard(async (img) => {
        await deleteWatchImage(watch.watchID, img.imageID)
        showToast('Slika obrisana', 'info')
    })

    const onPrimary = guard(async (img) => {
        await setPrimaryImage(watch.watchID, img.imageID)
        showToast('Glavna slika promenjena')
    })

    return (
        <Dialog open={Boolean(watch)} onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth
                slotProps={{ paper: { sx: { border: 1, borderColor: 'divider' } } }}>
            <DialogTitle sx={{ fontSize: 18 }}>
                Slike — {watch?.brand} {watch?.model}
            </DialogTitle>

            <DialogContent dividers>
                {loading && <Box sx={{ py: 4, textAlign: 'center' }}><CircularProgress size={28} /></Box>}

                {!loading && images.length === 0 && (
                    <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                        Ovaj sat još nema slika.
                    </Typography>
                )}

                {!loading && images.length > 0 && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                        {images.map(img => (
                            <Box key={img.imageID}
                                 sx={{ border: 1, borderColor: img.primary ? 'text.primary' : 'divider', p: 1 }}>
                                <Box sx={{ aspectRatio: '1 / 1', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    <Box component="img" src={imageUrl(img.imageID)} alt=""
                                         sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {img.primary
                                        ? <Chip size="small" label="Glavna"
                                                sx={{ borderRadius: 0, height: 18, fontSize: 9,
                                                    bgcolor: 'text.primary', color: 'background.paper' }} />
                                        : <IconButton size="small" disabled={busy}
                                                      onClick={() => onPrimary(img)}>
                                            <StarIcon sx={{ fontSize: 16 }} />
                                        </IconButton>}

                                    <IconButton size="small" disabled={busy} onClick={() => onDelete(img)}>
                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box sx={{ mt: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {images.length} / {MAX_IMAGES} slika
                    </Typography>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                           disabled={busy || images.length >= MAX_IMAGES}
                           onChange={onUpload} />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={busy} variant="contained"
                        sx={{ borderRadius: '999px', px: 3 }}>
                    Zatvori
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default WatchImagesDialog