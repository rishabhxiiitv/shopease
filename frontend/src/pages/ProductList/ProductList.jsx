import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories, setFilters } from '../../store/slices/productSlice'
import ProductCard from '../../components/ProductCard/ProductCard'
import './ProductList.css'

export default function ProductList() {
  const dispatch      = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items, categories, totalPages, currentPage, loading, filters } = useSelector((s) => s.product)
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const categoryParam = searchParams.get('category') || ''

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const params = {
      search:   filters.search,
      category: categoryParam || filters.category,
      page:     0,
      size:     12,
      sortBy:   filters.sortBy,
      sortDir:  filters.sortDir,
    }
    dispatch(fetchProducts(params))
  }, [dispatch, filters, categoryParam])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search }))
  }

  const handleCategory = (slug) => {
    setSearchParams(slug ? { category: slug } : {})
    dispatch(setFilters({ category: slug }))
  }

  const handleSort = (e) => {
    const [sortBy, sortDir] = e.target.value.split('-')
    dispatch(setFilters({ sortBy, sortDir }))
  }

  const handlePage = (p) => {
    dispatch(fetchProducts({ ...filters, category: categoryParam || filters.category, page: p, size: 12 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="product-list-page">
      <div className="container">

        {/* Toolbar */}
        <div className="pl-toolbar">
          <form onSubmit={handleSearch} className="pl-search">
            <input
              type="search"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          <select className="pl-sort" onChange={handleSort} defaultValue="createdAt-desc">
            <option value="createdAt-desc">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name A–Z</option>
          </select>
        </div>

        <div className="pl-layout">

          {/* Sidebar */}
          <aside className="pl-sidebar">
            <h3 className="pl-sidebar__title">Categories</h3>
            <ul className="pl-categories">
              <li>
                <button
                  className={`pl-cat-btn ${!categoryParam ? 'active' : ''}`}
                  onClick={() => handleCategory('')}
                >All Products</button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    className={`pl-cat-btn ${categoryParam === cat.slug ? 'active' : ''}`}
                    onClick={() => handleCategory(cat.slug)}
                  >{cat.name}</button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Products */}
          <div className="pl-main">
            {loading ? (
              <div className="page-loader"><div className="spinner" /></div>
            ) : items.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try different search terms or category</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={currentPage === 0}
                      onClick={() => handlePage(currentPage - 1)}
                    >← Prev</button>
                    <span className="pagination__info">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline btn-sm"
                      disabled={currentPage === totalPages - 1}
                      onClick={() => handlePage(currentPage + 1)}
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
