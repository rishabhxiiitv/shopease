import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as productService from '../../services/productService'

export const fetchProducts = createAsyncThunk(
  'product/fetchAll',
  async (params, { rejectWithValue }) => {
    try { return await productService.getProducts(params) }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to load products') }
  }
)

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id, { rejectWithValue }) => {
    try { return await productService.getProductById(id) }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Product not found') }
  }
)

export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (_, { rejectWithValue }) => {
    try { return await productService.getCategories() }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to load categories') }
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items:           [],
    selectedProduct: null,
    categories:      [],
    totalPages:      0,
    totalElements:   0,
    currentPage:     0,
    loading:         false,
    error:           null,
    filters: {
      search:      '',
      category:    '',
      sortBy:      'createdAt',
      sortDir:     'desc',
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,    (s) => { s.loading = true; s.error = null })
      .addCase(fetchProducts.fulfilled,  (s, a) => {
        s.loading       = false
        s.items         = a.payload.content
        s.totalPages    = a.payload.totalPages
        s.totalElements = a.payload.totalElements
        s.currentPage   = a.payload.page
      })
      .addCase(fetchProducts.rejected,   (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchProductById.pending,   (s) => { s.loading = true; s.error = null })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.selectedProduct = a.payload })
      .addCase(fetchProductById.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload })
  },
})

export const { setFilters, clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
