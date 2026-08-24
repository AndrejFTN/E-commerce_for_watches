import { useEffect, useState } from 'react'
import {
    Box, Typography, FormGroup, FormControlLabel, Checkbox, Slider, Divider,
    Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { LABELS } from '../labels'

function Section({ title, values, selected, onToggle, paramKey, defaultOpen = false }) {
    if (!values || values.length === 0) return null

    return (
        <Accordion
            defaultExpanded={defaultOpen || selected.length > 0}   // ako je filter aktivan, otvori ga
            disableGutters
            elevation={0}
            square
            sx={{
                bgcolor: 'transparent',
                borderBottom: 1, borderColor: 'divider',
                '&:before': { display: 'none' },                   // MUI podrazumevano crta liniju iznad
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}
                              sx={{ px: 0, minHeight: 48 }}>
                <Typography variant="overline" sx={{ letterSpacing: '0.15em', fontSize: 13 }}>
                    {title}
                    {selected.length > 0 && (
                        <Box component="span" sx={{ color: 'text.secondary', ml: 0.75 }}>
                            ({selected.length})
                        </Box>
                    )}
                </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
                <FormGroup>
                    {values.map((v) => (
                        <FormControlLabel
                            key={v}
                            control={
                                <Checkbox size="small"
                                          checked={selected.includes(v)}
                                          onChange={() => onToggle(paramKey, v)} />
                            }
                            label={<Typography variant="body2" sx={{ fontSize: 13.5 }}>{LABELS[v] ?? v}</Typography>}
                        />
                    ))}
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    )
}

function Filters({ options, params, onToggle, onPrice }) {
    const [range, setRange] = useState([0, 0])

    useEffect(() => {
        if (!options) return
        setRange([
            Number(params.get('minPrice') ?? options.minPrice),
            Number(params.get('maxPrice') ?? options.maxPrice),
        ])
    }, [options])                                          // eslint-disable-line

    if (!options) return null

    return (
        <Box sx={{
            position: 'sticky',                            // filteri ostaju dok skroluješ satove
            top: 130,                                      // zaglavlje je sada dva reda
            maxHeight: 'calc(100vh - 150px)',
            overflowX: 'hidden',
            overflowY: 'auto',                             // …dobijaju SVOJ skrol
            pr: 1.5,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 2 },
        }}>
            <Section title="Brend"     values={options.brands}     selected={params.getAll('brand')}     onToggle={onToggle} paramKey="brand" defaultOpen />
            <Section title="Pol"       values={options.genders}    selected={params.getAll('gender')}    onToggle={onToggle} paramKey="gender" />
            <Section title="Prilika"   values={options.occasions}  selected={params.getAll('occasion')}  onToggle={onToggle} paramKey="occasion" />
            <Section title="Mehanizam" values={options.mechanisms} selected={params.getAll('mechanism')} onToggle={onToggle} paramKey="mechanism" />
            <Section title="Boja"      values={options.colors}     selected={params.getAll('color')}     onToggle={onToggle} paramKey="color" />

            <Box sx={{ pt: 3 }}>
                <Typography variant="overline" sx={{ letterSpacing: '0.15em', fontSize: 13 }}>Cena</Typography>
                <Box sx={{ px: 1, pt: 1 }}>
                    <Slider value={range} min={options.minPrice} max={options.maxPrice}
                            onChange={(e, v) => setRange(v)}
                            onChangeCommitted={(e, v) => onPrice(v)}
                            valueLabelDisplay="auto" size="small" />
                    <Typography variant="body2" color="text.secondary">
                        {range[0]} € — {range[1]} €
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Filters