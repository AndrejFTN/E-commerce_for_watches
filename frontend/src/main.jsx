import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import { CartProvider } from './context/CartContext'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastProvider>
                <AuthProvider>
                    <FavoritesProvider>
                        <CartProvider>
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </CartProvider>
                    </FavoritesProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    </StrictMode>,
)