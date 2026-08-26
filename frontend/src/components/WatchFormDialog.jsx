import { useEffect, useState } from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button,
    MenuItem, Alert, Typography, LinearProgress,
} from '@mui/material'
import { addWatch, editWatch, addWatchImage } from '../api/watchApi'
import { useToast } from '../context/ToastContext'

const GENDERS = [
    { value: 'muski', label: 'Muški' },
    { value: 'zenski', label: 'Ženski' },
    { value: 'unisex', label: 'Unisex' },
]

const OCCASIONS = [
    { value: 'sportski', label: 'Sportski' },
    { value: 'elegantni', label: 'Elegantni' },
    { value: 'svakodnevni', label: 'Svakodnevni' },
    { value: 'poslovni', label: 'Poslovni' },
]

const EMPTY = {
    brand: '', model: '', color: '', mechanism: '',
    manufactureDate: '', price: '', stock: '',
    gender: 'muski', occasion: 'svakodnevni',
    description: '',
    discountPercentage: '', saleStartDate: '', saleEndDate: '',
}

function WatchFormDialog({ open, watch, onClose, onSaved }) {
    const { showToast } = useToast()
    const isEdit = Boolean(watch)

    const [form, setForm] = useState(EMPTY)
    const [files, setFiles] = useState([])             // samo pri dodavanju
    const [error, setError] = useState(null)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (!open) return
        setError(null)
        setFiles([])

        if (watch) {                                   // rezim izmene — polja se pune postojecim
            setForm({
                brand: watch.brand ?? '', model: watch.model ?? '',
                color: watch.color ?? '', mechanism: watch.mechanism ?? '',
                manufactureDate: watch.manufactureDate ?? '',
                price: watch.price ?? '', stock: watch.stock ?? '',
                gender: watch.gender ?? 'muski', occasion: watch.occasion ?? 'svakodnevni',
                description: watch.description ?? '',
                discountPercentage: watch.discountPercentage ?? '',
                saleStartDate: watch.saleStartDate ?? '',
                saleEndDate: watch.saleEndDate ?? '',
            })
        } else {
            setForm(EMPTY)
        }
    }, [open, watch])

    const change = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const payload = () => ({                           // prazna polja moraju kao null, ne kao ""
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description || null,
        discountPercentage: form.discountPercentage === '' ? null : Number(form.discountPercentage),
        saleStartDate: form.saleStartDate || null,
        saleEndDate: form.saleEndDate || null,
    })

    const submit = async (e) => {
        e.preventDefault()
        setBusy(true)
        setError(null)

        try {
            if (isEdit) {
                await editWatch({ watchID: watch.watchID, ...payload() })
                showToast('Sat je izmenjen')
            } else {
                const created = await addWatch(payload())        // 1. korak: podaci bez slika
                const id = created.data.watchID

                for (const file of files) {                      // 2. korak: slike JEDNA PO JEDNA
                    await addWatchImage(id, file)                // backend ne prima listu odjednom
                }
                showToast('Sat je dodat')
            }
            onSaved()
        } catch (err) {
            setError(err.response?.data?.message || 'Čuvanje nije uspelo')
        } finally {
            setBusy(false)
        }
    }

    return (
        <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth
                slotProps={{ paper: { sx: { border: 1, borderColor: 'divider' } } }}>
            <DialogTitle sx={{ fontSize: 18 }}>
                {isEdit ? 'Izmena sata' : 'Novi sat'}
            </DialogTitle>

            <DialogContent dividers>
                {busy && <LinearProgress sx={{ mb: 2 }} />}
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>{error}</Alert>}

                <Box component="form" id="watch-form" onSubmit={submit}
                     sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 1 }}>

                    <TextField name="brand" label="Brend" size="small" required
                               value={form.brand} onChange={change} />
                    <TextField name="model" label="Model" size="small" required
                               value={form.model} onChange={change} />

                    <TextField name="color" label="Boja" size="small" required
                               value={form.color} onChange={change} />
                    <TextField name="mechanism" label="Mehanizam" size="small" required
                               value={form.mechanism} onChange={change} />

                    <TextField name="manufactureDate" label="Datum proizvodnje" type="date"
                               size="small" required value={form.manufactureDate} onChange={change}
                               slotProps={{ inputLabel: { shrink: true } }} />
                    <TextField name="price" label="Cena (€)" type="number" size="small" required
                               value={form.price} onChange={change} />

                    <TextField name="stock" label="Stanje" type="number" size="small" required
                               value={form.stock} onChange={change} />
                    <TextField name="gender" label="Pol" size="small" select required
                               value={form.gender} onChange={change}>
                        {GENDERS.map(g => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                    </TextField>

                    <TextField name="occasion" label="Prilika" size="small" select required
                               value={form.occasion} onChange={change} sx={{ gridColumn: '1 / -1' }}>
                        {OCCASIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                    </TextField>

                    <TextField name="description" label="Opis" size="small" multiline rows={3}
                               value={form.description} onChange={change}
                               sx={{ gridColumn: '1 / -1' }}
                               slotProps={{ htmlInput: { maxLength: 2000 } }} />

                    <Typography variant="overline" color="text.secondary"
                                sx={{ gridColumn: '1 / -1', letterSpacing: '0.12em' }}>
                        Sniženje (opciono)
                    </Typography>

                    <TextField name="discountPercentage" label="Popust %" type="number" size="small"
                               value={form.discountPercentage} onChange={change}
                               helperText="5 do 90, prazno = bez sniženja" />
                    <Box />

                    <TextField name="saleStartDate" label="Sniženje od" type="date" size="small"
                               value={form.saleStartDate} onChange={change}
                               slotProps={{ inputLabel: { shrink: true } }} />
                    <TextField name="saleEndDate" label="Sniženje do" type="date" size="small"
                               value={form.saleEndDate} onChange={change}
                               slotProps={{ inputLabel: { shrink: true } }} />

                    {!isEdit && (
                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <Typography variant="overline" color="text.secondary"
                                        sx={{ letterSpacing: '0.12em', display: 'block', mb: 1 }}>
                                Slike (najviše 5)
                            </Typography>

                            <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                                   onChange={e => setFiles(Array.from(e.target.files).slice(0, 5))} />

                            {files.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                    {files.map((f, i) => (
                                        <Box key={i} sx={{ width: 64, height: 64, border: 1,
                                            borderColor: i === 0 ? 'text.primary' : 'divider',
                                            p: 0.5, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center' }}>
                                            <Box component="img"
                                                 src={URL.createObjectURL(f)}
                                                 alt=""
                                                 sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {files.length > 0 && (
                                <Typography variant="caption" color="text.secondary"
                                            sx={{ display: 'block', mt: 0.5 }}>
                                    Prva (uokvirena) postaje glavna
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>

                {isEdit && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                        Slike se menjaju preko dugmeta sa slikom u tabeli.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={busy} sx={{ color: 'text.secondary' }}>
                    Odustani
                </Button>
                <Button type="submit" form="watch-form" variant="contained" disabled={busy}
                        sx={{ borderRadius: '999px', px: 3 }}>
                    {isEdit ? 'Sačuvaj' : 'Dodaj'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default WatchFormDialog