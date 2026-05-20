import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, totalAmount, totalItems, isOpen, closeCart, fetchCart, updateItem, removeItem } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && isLoggedIn) fetchCart()
  }, [isOpen, isLoggedIn])

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  if (!isOpen) return null

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <aside className="cart-drawer">
        <div className="cart-drawer__header">
          <h2>Cart <span className="badge badge-blue">{totalItems}</span></h2>
          <button className="btn btn-ghost btn-sm" onClick={closeCart}>✕</button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="empty-state">
              <p>🛒</p>
              <h3>Your cart is empty</h3>
              <p>Start adding items to see them here</p>
            </div>
          ) : (
            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.cartItemId} className="cart-item">
                  <div className="cart-item__img-wrap">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.productName} />
                      : <span>📦</span>
                    }
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.productName}</p>
                    <p className="cart-item__price">${item.unitPrice.toFixed(2)}</p>
                    <div className="cart-item__qty">
                      <button
                        className="qty-btn"
                        onClick={() => item.quantity > 1
                          ? updateItem({ productId: item.productId, quantity: item.quantity - 1 })
                          : removeItem(item.productId)
                        }
                      >−</button>
                      <span>{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateItem({ productId: item.productId, quantity: item.quantity + 1 })}
                      >+</button>
                    </div>
                  </div>
                  <div className="cart-item__right">
                    <p className="cart-item__subtotal">${item.subtotal.toFixed(2)}</p>
                    <button className="btn btn-ghost btn-sm cart-item__remove" onClick={() => removeItem(item.productId)}>🗑</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Total</span>
              <span className="cart-drawer__total-amount">${totalAmount.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
