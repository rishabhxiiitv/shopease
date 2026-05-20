import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { clearCartState } from '../store/slices/cartSlice'

export function useAuth() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, isLoggedIn, loading, error } = useSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCartState())
    navigate('/login')
  }

  const isAdmin = user?.role === 'ADMIN'

  return { user, isLoggedIn, isAdmin, loading, error, logout: handleLogout }
}
