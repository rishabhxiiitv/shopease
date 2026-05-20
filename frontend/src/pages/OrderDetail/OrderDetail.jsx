import { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../../store/slices/orderSlice'
import './OrderDetail.css'

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
const STATUS_BADGE = {
  PLACED: 'badge-blue', CONFIRMED: 'badge-yellow',
  SHIPPED: 'badge-yellow', DELIVERED: 'badge-green', CANCELLED: 'badge-red',
}

export default function OrderDetail() {
  const { id }    = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const location  = useLocation()
  const { selectedOrder: order, loading } = useSelector((s) => s.order)
  const isSuccess = location.state?.success

  useEffect(() => { dispatch(fetchOrderById(id)) }, [dispatch, id])

  if (loading || !order) return <div className="page-loader"><div className="spinner" /></div>

  const stepIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="order-detail-page">
      <div className="container">
        <button className="btn btn-ghost btn-sm od-back" onClick={() => navigate('/orders')}>← My Orders</button>

        {isSuccess && (
          <div className="alert alert-success">
            Order placed successfully! We'll confirm it shortly.
          </div>
        )}

        <div className="od-header">
          <div>
            <h1>Order #{order.id}</h1>
            <p className="od-date">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className={`badge ${STATUS_BADGE[order.status] || 'badge-gray'}`}>{order.status}</span>
        </div>

        {/* Progress tracker */}
        {order.status !== 'CANCELLED' && (
          <div className="od-tracker card">
            <div className="od-steps">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className={`od-step ${i <= stepIndex ? 'done' : ''} ${i === stepIndex ? 'current' : ''}`}>
                  <div className="od-step__dot" />
                  <span className="od-step__label">{step}</span>
                  {i < STATUS_STEPS.length - 1 && <div className="od-step__line" />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="od-grid">
          {/* Items */}
          <div className="od-items card">
            <h2>Items</h2>
            <ul className="od-item-list">
              {order.items.map((item, i) => (
                <li key={i} className="od-item">
                  <div className="od-item__img-wrap">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} /> : <span>📦</span>}
                  </div>
                  <div className="od-item__info">
                    <p className="od-item__name">{item.productName}</p>
                    <p className="od-item__meta">${item.unitPrice.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <p className="od-item__subtotal">${item.subtotal.toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <div className="divider" />
            <div className="od-total">
              <span>Total</span>
              <span className="od-total__amount">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="od-summary card">
            <h2>Delivery Details</h2>
            <p className="od-address">{order.address}</p>
            <div className="divider" />
            <h2>Customer</h2>
            <p>{order.customerName}</p>
            <p className="od-email">{order.customerEmail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
