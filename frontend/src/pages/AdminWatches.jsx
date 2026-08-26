import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container, Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Button, Chip, Pagination, CircularProgress, Alert, TextField, Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import ImageIcon from '@mui/icons-material/ImageOutlined'
import AddIcon from '@mui/icons-material/Add'
import { getWatches, imageUrl, deleteWatch, setWatchStatus, addAmount } from '../api/watchApi'
import { useToast } from '../context/ToastContext'
import AdminNav from '../components/AdminNav'
import WatchFormDialog from '../components/WatchFormDialog'
import WatchImagesDialog from '../components/WatchImagesDialog'
import StockDialog from '../components/StockDialog'

const fmt = (n) => new Intl.NumberFormat('sr-RS', { maximumFractionDigits: 2 }).format(n)
const PAGE_SIZE = 12

function AdminWatches() {
  const { showToast } = useToast()

  const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [stockFor, setStockFor] = useState(null)
  const [params] = useSearchParams()
  const lowStock = params.get('sort') === 'stock'    // dolazak sa dashboard-a

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)       // null = dodavanje, objekat = izmena
  const [imagesFor, setImagesFor] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    const query = { page, size: PAGE_SIZE, sortBy: lowStock ? 'stock' : 'brand', sortDir: 'asc' }
    if (search) query.search = search
    if (lowStock) query.maxStock = 5                   // isti prag kao na dashboard-u

    getWatches(query)
        .then(r => setData(r.data))
        .catch(e => setError(e.response?.data?.message || e.message))
        .finally(() => setLoading(false))
  }, [page, search, lowStock])

  useEffect(load, [load])

  const guard = (fn) => async (...args) => {
    try {
      await fn(...args)
      load()                                     // tabela se osvezava sa backenda, ne rucno
    } catch (err) {
      showToast(err.response?.data?.message || 'Greška', 'error')
    }
  }

  const onDelete = guard(async (w) => {
    if (!window.confirm(`Obrisati ${w.brand} ${w.model}?`)) return
    await deleteWatch(w.watchID)
    showToast('Sat je obrisan', 'info')
  })

  const onToggle = guard(async (w) => {
    await setWatchStatus(w.watchID, !w.active)     // Jackson salje "active", ne "isActive"
    showToast(w.active ? 'Sat je sakriven' : 'Sat je vidljiv')
  })

  const onAddStock = guard(async (amount) => {
    await addAmount({ amount, watchID: stockFor.watchID })
    setStockFor(null)
    showToast(`Dodato ${amount} kom.`)
  })

  return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Admin panel</Typography>
        <AdminNav />

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Pretraga po brendu ili modelu"
                     value={search}
                     onChange={e => { setSearch(e.target.value); setPage(0) }}
                     sx={{ minWidth: 280 }} />

          <Typography variant="body2" color="text.secondary">
            Ukupno: {data.totalElements}
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />}
                  onClick={() => { setEditing(null); setFormOpen(true) }}
                  sx={{ ml: 'auto', borderRadius: '999px', px: 3 }}>
            Novi sat
          </Button>
        </Box>

        {loading && <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
            <Paper sx={{ border: 1, borderColor: 'divider', overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Brend / model</TableCell>
                    <TableCell align="right">Cena</TableCell>
                    <TableCell align="right">Stanje</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Radnje</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.content.map(w => (
                      <TableRow key={w.watchID} hover>
                        <TableCell sx={{ width: 56 }}>
                          <Box sx={{ width: 40, height: 40, border: 1, borderColor: 'divider',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.25 }}>
                            {w.primaryImageID
                                ? <Box component="img" src={imageUrl(w.primaryImageID)} alt=""
                                       sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                : <Typography variant="caption" color="text.secondary">—</Typography>}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{w.model}</Typography>
                          <Typography variant="caption" color="text.secondary">{w.brand}</Typography>
                        </TableCell>

                        <TableCell align="right">
                          {w.onSale
                              ? <>
                                <Typography variant="caption" color="text.secondary"
                                            sx={{ textDecoration: 'line-through', mr: 0.75 }}>
                                  {fmt(w.price)}
                                </Typography>
                                <Typography component="span" variant="body2" color="secondary.main">
                                  {fmt(w.effectivePrice)} €
                                </Typography>
                              </>
                              : <Typography variant="body2">{fmt(w.price)} €</Typography>}
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant="body2"
                                      color={w.stock === 0 ? 'error' : 'text.primary'}>
                            {w.stock}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip size="small" clickable onClick={() => onToggle(w)}
                                label={w.active ? 'Vidljiv' : 'Sakriven'}
                                sx={{ borderRadius: 0, height: 20, fontSize: 10, letterSpacing: '0.08em',
                                  bgcolor: w.active ? 'text.primary' : 'transparent',
                                  color: w.active ? 'background.paper' : 'text.primary',
                                  border: 1, borderColor: 'text.primary' }} />
                        </TableCell>

                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                          <Tooltip title="Dopuni stanje">
                            <IconButton size="small" onClick={() => onAddStock(w)}>
                              <AddIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Slike">
                            <IconButton size="small" onClick={() => setImagesFor(w)}>
                              <ImageIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Izmeni">
                            <IconButton size="small"
                                        onClick={() => { setEditing(w); setFormOpen(true) }}>
                              <EditIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Obriši">
                            <IconButton size="small" onClick={() => onDelete(w)}>
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
        )}

        {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination count={data.totalPages} page={data.number + 1}
                          onChange={(e, p) => setPage(p - 1)} shape="rounded" />
            </Box>
        )}

        <WatchFormDialog open={formOpen} watch={editing}
                         onClose={() => setFormOpen(false)}
                         onSaved={() => { setFormOpen(false); load() }} />

        <WatchImagesDialog watch={imagesFor}
                           onClose={() => setImagesFor(null)}
                           onChanged={load} />

        <StockDialog watch={stockFor}
                     onClose={() => setStockFor(null)}
                     onConfirm={onAddStock} />
      </Container>
  )
}

export default AdminWatches