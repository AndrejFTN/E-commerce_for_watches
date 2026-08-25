import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import WatchDetails from './pages/WatchDetails'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import OrderCancel from './pages/OrderCancel'
import OrderDetails from './pages/OrderDetails'
import AdminWatches from './pages/AdminWatches'
import AdminOrders from './pages/AdminOrders'
import AdminUsers from './pages/AdminUsers'
import Info from './pages/Info'

function App() {
        return (
            <Routes>
                    <Route element={<Layout />}>

                            <Route path="/" element={<Home />} />
                            <Route path="/watch/:watchID" element={<WatchDetails />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/informacije" element={<Info />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/contact" element={<Contact />} />

                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order/success" element={<OrderSuccess />} />
                            <Route path="/order/cancel" element={<OrderCancel />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/orders/:orderID" element={<OrderDetails />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/profile" element={<Profile />} />

                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/watches" element={<AdminWatches />} />
                            <Route path="/admin/orders" element={<AdminOrders />} />
                            <Route path="/admin/users" element={<AdminUsers />} />

                            <Route path="*" element={<h1>404 — stranica ne postoji</h1>} />
                    </Route>
            </Routes>
        )
}

export default App