import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from './store/slices/cartSlice'

import Navbar          from './components/Navbar/Navbar'
import CartDrawer      from './components/CartDrawer/CartDrawer'
import ProtectedRoute  from './components/ProtectedRoute/ProtectedRoute'

import Home            from './pages/Home/Home'
import ProductList     from './pages/ProductList/ProductList'
import ProductDetail   from './pages/ProductDetail/ProductDetail'
import Login           from './pages/Login/Login'
import Register        from './pages/Register/Register'
import Checkout        from './pages/Checkout/Checkout'
import OrderHistory    from './pages/OrderHistory/OrderHistory'
import OrderDetail     from './pages/OrderDetail/OrderDetail'

import Dashboard       from './pages/admin/Dashboard/Dashboard'
import ManageProducts  from './pages/admin/ManageProducts/ManageProducts'
import ManageOrders    from './pages/admin/ManageOrders/ManageOrders'

export default function App() {
  const dispatch   = useDispatch()
  const { isLoggedIn } = useSelector((s) => s.auth)

  // Load cart when user is authenticated
  useEffect(() => {
    if (isLoggedIn) dispatch(fetchCart())
  }, [isLoggedIn, dispatch])

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main>
        <Routes>
          {/* Public */}
          <Route path="/"          element={<Home />} />
          <Route path="/products"  element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* Protected — any logged-in user */}
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><OrderHistory /></ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute><OrderDetail /></ProtectedRoute>
          } />

          {/* Protected — admin only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
