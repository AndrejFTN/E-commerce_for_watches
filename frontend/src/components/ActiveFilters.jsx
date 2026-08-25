
import { LABELS } from '../labels'
import { Box, Chip, Link } from '@mui/material'

const LIST_KEYS = ['brand', 'gender', 'occasion', 'mechanism', 'color']

function ActiveFilters({ params, onToggle, onRemove, onClear }) {
    const chips = []

    const search = params.get('search')
    if (search) {
        chips.push({
            id: 'search',
            label: `Pretraga: „${search}”`,
            onDelete: () => onRemove('search'),
        })
    }

    for (const key of LIST_KEYS) {
        for (const value of params.getAll(key)) {
            chips.push({
                id: `${key}-${value}`,
                label: LABELS[value] ?? value,
                onDelete: () => onToggle(key, value),   // isti toggle kao checkbox  skida ga
            })
        }
    }

    const min = params.get('minPrice')
    const max = params.get('maxPrice')
    if (min || max) {
        chips.push({
            id: 'price',
            label: `${min ?? 0} € — ${max ?? '∞'} €`,
            onDelete: () => onRemove('price'),
        })
    }

    if (params.get('onSale') === 'true') {
        chips.push({
            id: 'onSale',
            label: 'Na sniženju',
            onDelete: () => onRemove('onSale'),
        })
    }

    if (chips.length === 0) return null            // nema aktivnih filtera → red se ne crta uopšte

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 3 }}>
            {chips.map(c => (
                <Chip
                    key={c.id}
                    label={c.label}
                    onDelete={c.onDelete}
                    size="small"
                    sx={{
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        borderRadius: '999px',
                        height: 26,
                        fontSize: 12,
                        letterSpacing: '0.02em',
                        '&:hover': { bgcolor: '#000' },
                        '& .MuiChip-deleteIcon': {
                            color: 'rgba(255,255,255,0.55)',
                            fontSize: 16,
                            '&:hover': { color: '#fff' },
                        },
                    }}
                />
            ))}

            <Link
                component="button"
                onClick={onClear}
                underline="hover"
                sx={{
                    ml: 0.5, fontSize: 11, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'text.secondary',
                    '&:hover': { color: 'text.primary' },
                }}
            >
                Poništi sve
            </Link>
        </Box>
    )
}

export default ActiveFilters