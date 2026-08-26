import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getCart, addItemToCart, deleteItemFromCart, updateItemAmount, emptyCart } from '../api/cartApi'
import { getOneWatch } from '../api/watchApi'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'guestCart'

const readGuest = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [] }
    catch { return [] }                                // pokvaren zapis ne sme da obori aplikaciju
}
const writeGuest = (raw) => localStorage.setItem(STORAGE_KEY, JSON.stringify(raw))

export function CartProvider({ children }) {
    const { isLoggedIn } = useAuth()
    const [lines, setLines] = useState([])
    const { showToast } = useToast()// jedinstven oblik, bez obzira odakle dolazi
    const [loading, setLoading] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)


    const loadGuest = useCallback(async () => {
        const raw = readGuest()
        if (raw.length === 0) { setLines([]); return }

        setLoading(true)
        try {
            const res = await Promise.all(raw.map(r => getOneWatch(r.watchID)))
            setLines(res.map((r, i) => {
                const w = r.data
                const primary = (w.images ?? []).find(im => im.primary) ?? w.images?.[0]
                return {
                    watchID: w.watchID,
                    quantity: raw[i].quantity,
                    cartItemID: null,                  // gost nema stavku u bazi
                    brand: w.brand, model: w.model,
                    primaryImageID: primary?.imageID ?? null,
                    stock: w.stock,
                    effectivePrice: w.effectivePrice,
                    onSale: w.onSale,
                }
            }))
        } finally { setLoading(false) }
    }, [])


    const loadServer = useCallback(async () => {
        setLoading(true)
        try {
            const r = await getCart()
            setLines((r.data.cartItems ?? []).map(i => ({
                watchID: i.watchID,
                quantity: i.amount,
                cartItemID: i.cartItemID,
                brand: i.brand, model: i.model,
                primaryImageID: i.primaryImageID,
                stock: i.stock,
                effectivePrice: i.effectivePrice,
                onSale: i.onSale,
            })))
        } catch {
            setLines([])
        } finally { setLoading(false) }
    }, [])

    useEffect(() => {
        if (!isLoggedIn) { loadGuest(); return }

        const merge = async () => {
            const raw = readGuest()
            let skipped = 0

            for (const r of raw) {
                try {
                    await addItemToCart({ watchID: r.watchID, amount: r.quantity })
                } catch {
                    skipped++                          // nema dovoljno na stanju ili je sat obrisan
                }
            }

            localStorage.removeItem(STORAGE_KEY)       // korpa je sad u bazi
            await loadServer()

            if (skipped > 0) {
                showToast(`${skipped} stavki iz korpe nije moglo da se prenese`, 'error')
            }
        }
        merge()
    }, [isLoggedIn, loadGuest, loadServer])

    const addToCart = async (watchID, quantity = 1, maxStock = Infinity) => {
        if (isLoggedIn) {
            await addItemToCart({ watchID, amount: quantity })
            await loadServer()
            setDrawerOpen(true)                        // korpa se sama otvori posle dodavanja
            return
        }
        const raw = readGuest()
        const found = raw.find(i => i.watchID === watchID)
        writeGuest(found
            ? raw.map(i => i.watchID === watchID
                ? { ...i, quantity: Math.min(i.quantity + quantity, maxStock) } : i)
            : [...raw, { watchID, quantity: Math.min(quantity, maxStock) }])
        await loadGuest()
        setDrawerOpen(true)
    }

    const setQuantity = async (line, quantity) => {
        if (quantity < 1) return
        if (isLoggedIn) {
            await updateItemAmount(line.cartItemID, quantity)
            await loadServer()
            return
        }
        writeGuest(readGuest().map(i => i.watchID === line.watchID ? { ...i, quantity } : i))
        await loadGuest()
    }

    const removeItem = async (line) => {
        if (isLoggedIn) {
            await deleteItemFromCart(line.cartItemID)
            await loadServer()
            return
        }
        writeGuest(readGuest().filter(i => i.watchID !== line.watchID))
        await loadGuest()
    }

    const clearCart = async () => {
        if (isLoggedIn) {
            await emptyCart()
            await loadServer()
            return
        }
        writeGuest([])
        setLines([])
    }

    const count = lines.reduce((s, l) => s + l.quantity, 0)

    return (
        <CartContext.Provider value={{
            lines, items: lines,
            count, loading,
            addToCart, setQuantity, removeItem, clearCart,
            reload: isLoggedIn ? loadServer : loadGuest,
            drawerOpen,
            closeDrawer: () => setDrawerOpen(false),
            toggleDrawer: () => setDrawerOpen(o => !o),
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)