import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#F5F4F2',
            paper: '#FFFFFF',
        },
        primary: {
            main: '#1A1A1A',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#A98B5D',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#6E6E6A',
        },
        divider: 'rgba(0,0,0,0.10)',
    },
    typography: {
        fontFamily: '"Inter", system-ui, sans-serif',
        h1: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, letterSpacing: '0.02em' },
        h2: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, letterSpacing: '0.02em' },
        h5: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 400 },
        h6: { fontWeight: 500, letterSpacing: '0.04em' },
        button: { textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500 },
    },
    components: {
        MuiPaper: { defaultProps: { elevation: 0 } },
        MuiCard: { defaultProps: { variant: 'outlined' } },
        MuiButton: { defaultProps: { disableElevation: true } },
    },
})

export default theme