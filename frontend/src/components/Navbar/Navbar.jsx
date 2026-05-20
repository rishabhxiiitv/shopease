import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import './Navbar.css'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const { totalItems, openCart } = useCart()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="container navbar__inner">

        <Link to="/" className="navbar__logo">ShopEase</Link>

        <div className="navbar__links">
          <Link to="/products" className="navbar__link">Products</Link>
          {isAdmin && <Link to="/admin" className="navbar__link">Admin</Link>}
        </div>

        <div className="navbar__actions">
          {isLoggedIn ? (
            <>
              <button className="navbar__cart-btn" onClick={openCart}>
                <span className="navbar__cart-icon">🛒</span>
                {totalItems > 0 && (
                  <span className="navbar__cart-badge">{totalItems}</span>
                )}
              </button>
              <Link to="/orders" className="navbar__link">Orders</Link>
              <div className="navbar__user">
                <span className="navbar__user-name">{user?.name}</span>
                <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Register</button>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
