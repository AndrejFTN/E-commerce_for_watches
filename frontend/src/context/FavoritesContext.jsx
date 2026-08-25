import { createContext, useContext, useEffect, useState } from 'react'
import { getMyFavorites, addFavorite, removeFavorite } from '../api/favoriteApi'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
    const { isLoggedIn } = useAuth()
    const [ids, setIds] = useState(new Set())          // skup watchID-jeva, brza provera

    useEffect(() => {
        if (!isLoggedIn) { setIds(new Set()); return }  // odjava → prazan skup

        getMyFavorites({ page: 0, size: 200 })         // dovoljno veliko da pokupi sve
            .then(r => setIds(new Set(r.data.content.map(f => f.watchID))))
            .catch(() => setIds(new Set()))
    }, [isLoggedIn])                                   // ponovo se učita pri svakoj prijavi

    const isFavorite = (watchID) => ids.has(watchID)

    const toggleFavorite = async (watchID) => {
        if (ids.has(watchID)) {
            await removeFavorite(watchID)
            setIds(prev => {
                const next = new Set(prev)
                next.delete(watchID)
                return next
            })
            return false                               // vraća novo stanje, da komponenta zna šta da javi
        }

        await addFavorite(watchID)
        setIds(prev => new Set(prev).add(watchID))
        return true
    }

    return (
        <FavoritesContext.Provider value={{ isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => useContext(FavoritesContext)