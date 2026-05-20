import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories } from '../../../store/slices/productSlice'
import * as productService from '../../../services/productService'
import './ManageProducts.css'

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', categoryId: '' }

export default function ManageProducts() {
  const dispatch = useDispatch()
  const { items, categories, loading } = useSelector((s) => s.product)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [editId,    setEditId]    = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState(null)

  useEffect(() => {
    dispatch(fetchProducts({ size: 50 }))
    dispatch(fetchCategories())
  }, [dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, categoryId: p.categoryId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), categoryId: parseInt(form.categoryId) }
      let saved
      if (editId) {
        saved = await productService.updateProduct(editId, payload)
      } else {
        saved = await productService.createProduct(payload)
      }
      if (imageFile && saved.id) {
        await productService.uploadProductImage(saved.id, imageFile)
      }
      setMsg({ type: 'success', text: `Product ${editId ? 'updated' : 'created'} successfully` })
      setForm(EMPTY_FORM); setEditId(null); setImageFile(null)
      dispatch(fetchProducts({ size: 50 }))
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save product' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await productService.deleteProduct(id)
    dispatch(fetchProducts({ size: 50 }))
  }

  return (
    <div className="manage-products-page">
      <div className="container">
        <h1 className="mp-title">{editId ? 'Edit Product' : 'Add Product'}</h1>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="card mp-form-card">
          <form onSubmit={handleSubmit} className="mp-form">
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
            </div>
            <div className="mp-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="">Select…</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Image (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
            <div className="mp-form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Update Product' : 'Create Product'}
              </button>
              {editId && (
                <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY_FORM) }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 className="mp-list-title">Products ({items.length})</h2>
        {loading ? <div className="spinner" /> : (
          <div className="card">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.categoryName || '—'}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="mp-row-actions">
                        <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
