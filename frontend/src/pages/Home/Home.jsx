import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories } from '../../store/slices/productSlice'
import ProductCard from '../../components/ProductCard/ProductCard'
import './Home.css'

export default function Home() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { items, categories, loading } = useSelector((s) => s.product)

  useEffect(() => {
    dispatch(fetchProducts({ size: 8, sortBy: 'createdAt', sortDir: 'desc' }))
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div className="home">

      {/* Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <h1 className="hero__title">Shop smarter,<br />live better.</h1>
            <p className="hero__sub">Discover thousands of products delivered right to your door.</p>
            <div className="hero__actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/products')}>
                Shop Now
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/register')}>
                Join Free
              </button>
            </div>
          </div>
          <div className="hero__visual">🛍️</div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section__title">Shop by Category</h2>
            <div className="category-grid">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="category-chip"
                  onClick={() => navigate(`/products?category=${cat.slug}`)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">New Arrivals</h2>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/products')}>
              View All →
            </button>
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
