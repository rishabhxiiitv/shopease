import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearSelectedProduct } from '../../store/slices/productSlice'
import { addItemToCart } from '../../store/slices/cartSlice'
import { openCart } from '../../store/slices/cartSlice'
import { useAuth } from '../../hooks/useAuth'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id }    = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { isLoggedIn } = useAuth()
  const { selectedProduct: product, loading, error } = useSelector((s) => s.product)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    dispatch(fetchProductById(id))
    return () => dispatch(clearSelectedProduct())
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (!isLoggedIn) { navigate('/login'); return }
    dispatch(addItemToCart({ productId: product.id, quantity: qty }))
    dispatch(openCart())
  }

  if (loading) return <div className="page-loader"><div className="spinner" /></div>
  if (error)   return <div className="container"><div className="alert alert-error">{error}</div></div>
  if (!product) return null

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="btn btn-ghost btn-sm pd-back" onClick={() => navigate(-1)}>← Back</button>

        <div className="pd-grid">
          {/* Image */}
          <div className="pd-img-wrap">
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} className="pd-img" />
              : <div className="pd-img-placeholder">📦</div>
            }
          </div>

          {/* Info */}
          <div className="pd-info">
            {product.categoryName && (
              <span className="badge badge-blue">{product.categoryName}</span>
            )}
            <h1 className="pd-name">{product.name}</h1>
            <p className="pd-price">${product.price.toFixed(2)}</p>

            {product.description && (
              <p className="pd-desc">{product.description}</p>
            )}

            <div className="pd-stock">
              {product.stock > 0
                ? <span className="badge badge-green">In Stock ({product.stock} available)</span>
                : <span className="badge badge-red">Out of Stock</span>
              }
            </div>

            {product.stock > 0 && (
              <div className="pd-actions">
                <div className="pd-qty">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="btn btn-primary btn-lg pd-add-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
