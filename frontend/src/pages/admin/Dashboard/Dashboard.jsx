import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders } from '../../../store/slices/orderSlice'
import { fetchProducts } from '../../../store/slices/productSlice'
import './Dashboard.css'

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, totalPages } = useSelector((s) => s.order)
  const { items: products, totalElements } = useSelector((s) => s.product)

  useEffect(() => {
    dispatch(fetchAllOrders({ page: 0, size: 5 }))
    dispatch(fetchProducts({ page: 0, size: 5 }))
  }, [dispatch])

  const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pending  = orders.filter(o => o.status === 'PLACED').length

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dash-header">
          <h1>Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          {[
            { label: 'Total Products', value: totalElements, icon: '📦', action: () => navigate('/admin/products') },
            { label: 'Total Orders',   value: orders.length, icon: '📋', action: () => navigate('/admin/orders') },
            { label: 'Pending Orders', value: pending,        icon: '⏳', action: () => navigate('/admin/orders') },
            { label: 'Revenue (page)', value: `$${revenue.toFixed(0)}`, icon: '💰', action: null },
          ].map((stat) => (
            <div key={stat.label} className={`stat-card card ${stat.action ? 'clickable' : ''}`} onClick={stat.action}>
              <div className="stat-card__icon">{stat.icon}</div>
              <div>
                <p className="stat-card__value">{stat.value}</p>
                <p className="stat-card__label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="dash-actions">
          <button className="btn btn-primary" onClick={() => navigate('/admin/products')}>
            Manage Products
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/admin/orders')}>
            Manage Orders
          </button>
        </div>

        {/* Recent orders */}
        <div className="card dash-recent">
          <div className="dash-recent__header">
            <h2>Recent Orders</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/orders')}>View all →</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} style={{ cursor: 'pointer' }}>
                  <td>#{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>${o.totalAmount.toFixed(2)}</td>
                  <td><span className="badge badge-blue">{o.status}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
