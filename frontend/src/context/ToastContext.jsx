import { createContext, useContext, useState } from 'react'
import { Snackbar, Box, Typography, Slide } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const ToastContext = createContext(null)

function SlideDown(props) {                            // poruka „pada" odozgo umesto da se uveća
    return <Slide {...props} direction="down" />
}

export function ToastProvider({ children }) {
    const [open, setOpen] = useState(false)
    const [toast, setToast] = useState({ message: '', severity: 'success' })
    // odvojeno od `open` da tekst
    // ostane vidljiv dok poruka nestaje

    const showToast = (message, severity = 'success') => {
        setToast({ message, severity })
        setOpen(true)
    }

    const isError = toast.severity === 'error'

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <Snackbar
                open={open}
                autoHideDuration={2500}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                slots={{ transition: SlideDown }}
                sx={{ mt: 5 }}                             // odmah ispod trake
            >
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    bgcolor: 'background.paper',
                    border: 1, borderColor: 'divider',
                    borderRadius: '999px',                 // pilula, kao čipovi i sort
                    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                    px: 2.5, py: 1.25,
                    maxWidth: 420,
                }}>
                    {isError
                        ? <CloseIcon sx={{ fontSize: 18, color: 'text.primary' }} />
                        : <CheckIcon sx={{ fontSize: 18, color: 'text.primary' }} />}

                    <Typography sx={{ fontSize: 13.5, color: 'text.primary', lineHeight: 1.3 }}>
                        {toast.message}
                    </Typography>
                </Box>
            </Snackbar>
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)