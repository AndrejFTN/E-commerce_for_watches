import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box, Container, Typography, Pagination, Select, MenuItem, CircularProgress, Alert } from '@mui/material'
import { getWatches, getFilterOptions } from '../api/watchApi'
import WatchCard from '../components/WatchCard'
import Filters from '../components/Filters'
import ActiveFilters from '../components/ActiveFilters'
import HeroSlider from '../components/HeroSlider'


const PAGE_SIZE = 9

function Home() {
    const [params, setParams] = useSearchParams()
    const [options, setOptions] = useState(null)
    const [data, setData] = useState({ content: [], totalPages: 0, number: 0, totalElements: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getFilterOptions().then(r => setOptions(r.data)).catch(() => {})
    }, [])

    useEffect(() => {
        setLoading(true)
        setError(null)

        const query = {
            page: Number(params.get('page') ?? 0),
            size: PAGE_SIZE,
            sortBy: params.get('sortBy') || 'createdAt',
            sortDir: params.get('sortDir') || 'desc',
        }
        const search = params.get('search')
        if (search) query.search = search
        const min = params.get('minPrice')
        if (min) query.minPriceFilter = min
        const max = params.get('maxPrice')
        if (max) query.maxPriceFilter = max
        if (params.get('onSale') === 'true') query.onSale = true
        if (params.get('newArrival') === 'true') query.newArrival = true

        for (const key of ['brand', 'color', 'mechanism', 'gender', 'occasion']) {
            const values = params.getAll(key)
            if (values.length) query[key] = values
        }

        getWatches(query)
            .then(r => setData(r.data))
            .catch(e => setError(e.response?.data?.message || e.message))
            .finally(() => setLoading(false))
    }, [params])

    const toggle = (key, value) => {
        const next = new URLSearchParams(params)
        const current = next.getAll(key)
        next.delete(key)
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value]
        updated.forEach(v => next.append(key, v))
        next.set('page', '0')
        setParams(next)
    }

    const onPrice = ([min, max]) => {
        const next = new URLSearchParams(params)
        next.set('minPrice', min)
        next.set('maxPrice', max)
        next.set('page', '0')
        setParams(next)
    }

    const onClear = () => setParams(new URLSearchParams())

    const onRemove = (key) => {
        const next = new URLSearchParams(params)
        if (key === 'price') {
            next.delete('minPrice')
            next.delete('maxPrice')
        } else {
            next.delete(key)
        }
        next.set('page', '0')
        setParams(next)
    }


    const onSort = (value) => {
        const [sortBy, sortDir] = value.split(':')
        const next = new URLSearchParams(params)
        next.set('sortBy', sortBy)
        next.set('sortDir', sortDir)
        next.set('page', '0')
        setParams(next)
    }

    const onPage = (e, page) => {
        const next = new URLSearchParams(params)
        next.set('page', page - 1)
        setParams(next)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <HeroSlider />

            <Container id="katalog" sx={{ py: 6, scrollMarginTop: '130px' }}>
            <Box sx={{ display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '240px 1fr' },
                columnGap: 4, rowGap: 0 }}>

                <Box sx={{ display: { xs: 'none', md: 'block' } }} />


                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                        Rezultata: {data.totalElements}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            Sortiraj
                        </Typography>
                        <Select
                            size="small"
                            value={`${params.get('sortBy') || 'createdAt'}:${params.get('sortDir') || 'desc'}`}
                            onChange={(e) => onSort(e.target.value)}
                            MenuProps={{
                                PaperProps: { sx: { borderRadius: 2, mt: 0.5, border: 1, borderColor: 'divider' } },
                            }}
                            sx={{
                                minWidth: 190,
                                fontSize: 13,
                                borderRadius: '999px',
                                pl: 0.5,
                                '& .MuiSelect-select': { py: 0.75 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'text.primary' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: 'text.primary' },
                            }}
                        >
                            <MenuItem sx={{ fontSize: 13 }} value="createdAt:desc">Najnovije</MenuItem>
                            <MenuItem sx={{ fontSize: 13 }} value="price:asc">Cena — rastuće</MenuItem>
                            <MenuItem sx={{ fontSize: 13 }} value="price:desc">Cena — opadajuće</MenuItem>
                            <MenuItem sx={{ fontSize: 13 }} value="brand:asc">Brend — A do Ž</MenuItem>
                        </Select>
                    </Box>
                </Box>

                <Box>
                    <Filters options={options} params={params}
                             onToggle={toggle} onPrice={onPrice} />
                </Box>

                <Box>
                    <ActiveFilters params={params} onToggle={toggle}
                                   onRemove={onRemove} onClear={onClear} />

                    {loading && <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box>}
                    {error && <Alert severity="error">{error}</Alert>}

                    {!loading && !error && data.content.length === 0 && (
                        <Typography color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
                            Nema satova koji odgovaraju izabranim filterima.
                        </Typography>
                    )}

                    {!loading && !error && data.content.length > 0 && (
                        <Box sx={{ display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                            gap: 3 }}>
                            {data.content.map(w => <WatchCard key={w.watchID} watch={w} />)}
                        </Box>
                    )}

                    {data.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                            <Pagination count={data.totalPages} page={data.number + 1} onChange={onPage} shape="rounded" />
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
</>

    )
}

export default Home