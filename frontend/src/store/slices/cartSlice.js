import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as cartService from '../../services/cartService'

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try { return await cartService.getCart() }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to load cart') }
})

export const addItemToCart = createAsyncThunk('cart/add', async (payload, { rejectWithValue }) => {
  try { return await cartService.addToCart(payload) }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to add item') }
})

export const updateItem = createAsyncThunk('cart/update', async (payload, { rejectWithValue }) => {
  try { return await cartService.updateCartItem(payload) }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to update item') }
})

export const removeItem = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
  try { return await cartService.removeFromCart(productId) }
  catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to remove item') }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartId:      null,
    items:       [],
    totalAmount: 0,
    totalItems:  0,
    isOpen:      false,
    loading:     false,
    error:       null,
  },
  reducers: {
    toggleCart(state) { state.isOpen = !state.isOpen },
    openCart(state)   { state.isOpen = true },
    closeCart(state)  { state.isOpen = false },
    clearCartState(state) {
      state.cartId = null; state.items = []; state.totalAmount = 0; state.totalItems = 0
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading     = false
      state.cartId      = action.payload.cartId
      state.items       = action.payload.items
      state.totalAmount = action.payload.totalAmount
      state.totalItems  = action.payload.totalItems
    }
    builder
      .addCase(fetchCart.pending,      (s) => { s.loading = true; s.error = null })
      .addCase(fetchCart.fulfilled,    setCart)
      .addCase(fetchCart.rejected,     (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(addItemToCart.pending,  (s) => { s.loading = true; s.error = null })
      .addCase(addItemToCart.fulfilled, setCart)
      .addCase(addItemToCart.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(updateItem.fulfilled,   setCart)
      .addCase(removeItem.fulfilled,   setCart)
  },
})

export const { toggleCart, openCart, closeCart, clearCartState } = cartSlice.actions
export default cartSlice.reducer
