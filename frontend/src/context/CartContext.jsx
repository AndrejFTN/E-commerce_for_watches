import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'guestCart'

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []                       // korpa prezivi osvežavanje stranice
    })

    useEffect(() => {                                             // svaka promena se odmah upisuje nazad
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }, [items])

    const addToCart = (watchID, quantity = 1) => {
        setItems(prev => {
            const found = prev.find(i => i.watchID === watchID)
            if (found) {
                return prev.map(i => i.watchID === watchID
                    ? { ...i, quantity: i.quantity + quantity }
                    : i)
            }
            return [...prev, { watchID, quantity }]
        })
    }

    const removeFromCart = (watchID) => setItems(prev => prev.filter(i => i.watchID !== watchID))

    const setQuantity = (watchID, quantity) =>
        setItems(prev => prev.map(i => i.watchID === watchID ? { ...i, quantity } : i))

    const clearCart = () => setItems([])

    const count = items.reduce((sum, i) => sum + i.quantity, 0)   // broj koji stoji na ikonici korpe

    return (
        <CartContext.Provider value={{ items, count, addToCart, removeFromCart, setQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)