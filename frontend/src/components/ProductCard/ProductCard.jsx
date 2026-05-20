import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../../store/slices/cartSlice'
import { openCart } from '../../store/slices/cartSlice'
import { useAuth } from '../../hooks/useAuth'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoggedIn } = useAuth()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!isLoggedIn) { navigate('/login'); return }
    dispatch(addItemToCart({ productId: product.id, quantity: 1 }))
    dispatch(openCart())
  }

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-card__img-wrap">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} className="product-card__img" />
          : <div className="product-card__img-placeholder">📦</div>
        }
        {product.stock === 0 && (
          <span className="product-card__out-of-stock">Out of Stock</span>
        )}
      </div>

      <div className="product-card__body">
        {product.categoryName && (
          <span className="badge badge-blue product-card__category">{product.categoryName}</span>
        )}
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__footer">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
