import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders } from '../../store/slices/orderSlice'
import './OrderHistory.css'

const STATUS_BADGE = {
  PLACED:    'badge-blue',
  CONFIRMED: 'badge-yellow',
  SHIPPED:   'badge-yellow',
  DELIVERED: 'badge-green',
  CANCELLED: 'badge-red',
}

export default function OrderHistory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((s) => s.order)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  if (loading) return <div className="page-loader"><div className="spinner" /></div>

  return (
    <div className="order-history-page">
      <div className="container">
        <h1 className="oh-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you place one</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/products')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card card" onClick={() => navigate(`/orders/${order.id}`)}>
                <div className="order-card__header">
                  <div>
                    <p className="order-card__id">Order #{order.id}</p>
                    <p className="order-card__date">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge ${STATUS_BADGE[order.status] || 'badge-gray'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-card__items">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} className="order-card__item-name">
                      {item.productName} × {item.quantity}
                      {i < Math.min(order.items.length, 3) - 1 ? ', ' : ''}
                    </span>
                  ))}
                  {order.items.length > 3 && <span className="order-card__more">+{order.items.length - 3} more</span>}
                </div>
                <div className="order-card__footer">
                  <span className="order-card__total">${order.totalAmount.toFixed(2)}</span>
                  <span className="order-card__link">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
