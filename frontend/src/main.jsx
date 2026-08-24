import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'   // reset browser stilova + primena teme na body
import theme from './theme'
import { CartProvider } from './context/CartContext'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastProvider>                            {/* mora unutar ThemeProvider-a */}
                <CartProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </CartProvider>
            </ToastProvider>
        </ThemeProvider>
    </StrictMode>,
)