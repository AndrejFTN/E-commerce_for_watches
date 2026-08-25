import { Box, Badge } from '@mui/material'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { useCart } from '../context/CartContext'
import { DRAWER_WIDTH } from './CartDrawer'

function CartTab({ open, onToggle }) {
    const { count } = useCart()

    return (
        <Box onClick={onToggle}
             sx={{
                 position: 'fixed',
                 right: open ? DRAWER_WIDTH : 0,
                 bottom: 120,
                 zIndex: 1300,
                 bgcolor: 'background.paper',
                 color: 'text.primary',
                 border: 1, borderRight: 0, borderColor: 'divider',
                 boxShadow: '-2px 0 12px rgba(0,0,0,0.06)',
                 px: 1.25, py: 1.75, cursor: 'pointer',
                 borderRadius: '6px 0 0 6px',
                 transition: 'right 225ms cubic-bezier(0, 0, 0.2, 1)',
                 display: 'flex', alignItems: 'center',
                 '&:hover': { bgcolor: '#fff', borderColor: 'text.primary' },
             }}>
            <Badge badgeContent={count} color="secondary">
                <ShoppingBagOutlinedIcon fontSize="small" />
            </Badge>
        </Box>
    )
}

export default CartTab