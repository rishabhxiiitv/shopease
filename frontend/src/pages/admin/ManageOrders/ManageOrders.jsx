import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, updateStatus } from '../../../store/slices/orderSlice'
import './ManageOrders.css'

const STATUSES = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_BADGE = {
  PLACED: 'badge-blue', CONFIRMED: 'badge-yellow',
  SHIPPED: 'badge-yellow', DELIVERED: 'badge-green', CANCELLED: 'badge-red',
}

export default function ManageOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((s) => s.order)

  useEffect(() => { dispatch(fetchAllOrders({ size: 50 })) }, [dispatch])

  const handleStatus = (id, status) => {
    dispatch(updateStatus({ id, status }))
  }

  if (loading) return <div className="page-loader"><div className="spinner" /></div>

  return (
    <div className="manage-orders-page">
      <div className="container">
        <h1 className="mo-title">Manage Orders</h1>

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/orders/${o.id}`)}>
                      #{o.id}
                    </button>
                  </td>
                  <td>
                    <p>{o.customerName}</p>
                    <p className="mo-email">{o.customerEmail}</p>
                  </td>
                  <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td>${o.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[o.status] || 'badge-gray'}`}>{o.status}</span>
                  </td>
                  <td>
                    <select
                      className="mo-status-select"
                      value={o.status}
                      onChange={(e) => handleStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
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
