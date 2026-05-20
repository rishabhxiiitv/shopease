import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { placeOrder } from '../../store/slices/orderSlice'
import { clearCartState } from '../../store/slices/cartSlice'
import './Checkout.css'

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalAmount } = useSelector((s) => s.cart)
  const { loading, error } = useSelector((s) => s.order)
  const [address, setAddress] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(placeOrder({ address }))
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCartState())
      navigate(`/orders/${result.payload.id}`, { state: { success: true } })
    }
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: '4rem' }}>
          <h3>Your cart is empty</h3>
          <p>Add items before checking out</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout__title">Checkout</h1>

        <div className="checkout-grid">
          {/* Order Form */}
          <div className="checkout-form-wrap card">
            <h2>Delivery Address</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="address">Full Address</label>
                <textarea
                  id="address"
                  rows={4}
                  placeholder="Street, City, State, ZIP, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? 'Placing order…' : `Place Order · $${totalAmount.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary card">
            <h2>Order Summary</h2>
            <ul className="checkout-items">
              {items.map((item) => (
                <li key={item.cartItemId} className="checkout-item">
                  <span className="checkout-item__name">{item.productName} × {item.quantity}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="divider" />
            <div className="checkout-total">
              <span>Total</span>
              <span className="checkout-total__amount">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
