import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as orderService from '../../services/orderService'

export const placeOrder = createAsyncThunk(
  'order/place',
  async (payload, { rejectWithValue }) => {
    try { return await orderService.placeOrder(payload) }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to place order') }
  }
)

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMine',
  async (params, { rejectWithValue }) => {
    try { return await orderService.getMyOrders(params) }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to load orders') }
  }
)

export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (id, { rejectWithValue }) => {
    try { return await orderService.getOrderById(id) }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Order not found') }
  }
)

export const fetchAllOrders = createAsyncThunk(
  'order/fetchAll',
  async (params, { rejectWithValue }) => {
    try { return await orderService.getAllOrders(params) }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to load orders') }
  }
)

export const updateStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try { return await orderService.updateOrderStatus(id, status) }
    catch (err) { return rejectWithValue(err.response?.data?.error || 'Failed to update status') }
  }
)

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders:        [],
    selectedOrder: null,
    totalPages:    0,
    loading:       false,
    error:         null,
  },
  reducers: {
    clearOrderError(state) { state.error = null },
    clearSelectedOrder(state) { state.selectedOrder = null },
  },
  extraReducers: (builder) => {
    const setOrders = (s, a) => {
      s.loading    = false
      s.orders     = a.payload.content
      s.totalPages = a.payload.totalPages
    }
    builder
      .addCase(placeOrder.pending,    (s) => { s.loading = true; s.error = null })
      .addCase(placeOrder.fulfilled,  (s, a) => { s.loading = false; s.selectedOrder = a.payload })
      .addCase(placeOrder.rejected,   (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchMyOrders.pending,   (s) => { s.loading = true })
      .addCase(fetchMyOrders.fulfilled, setOrders)
      .addCase(fetchMyOrders.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchOrderById.fulfilled, (s, a) => { s.selectedOrder = a.payload })
      .addCase(fetchAllOrders.pending,   (s) => { s.loading = true })
      .addCase(fetchAllOrders.fulfilled, setOrders)
      .addCase(fetchAllOrders.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(updateStatus.fulfilled, (s, a) => {
        s.orders = s.orders.map(o => o.id === a.payload.id ? a.payload : o)
      })
  },
})

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions
export default orderSlice.reducer
