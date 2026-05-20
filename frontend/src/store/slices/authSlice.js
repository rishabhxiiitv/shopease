import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '../../services/authService'

const savedUser  = JSON.parse(localStorage.getItem('user')  || 'null')
const savedToken = localStorage.getItem('token') || null

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.register(payload)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Registration failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:      savedUser,
    token:     savedToken,
    isLoggedIn: !!savedToken,
    loading:   false,
    error:     null,
  },
  reducers: {
    logout(state) {
      state.user      = null
      state.token     = null
      state.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null }
    const handleFulfilled = (state, action) => {
      state.loading    = false
      state.token      = action.payload.token
      state.isLoggedIn = true
      state.user       = { name: action.payload.name, email: action.payload.email, role: action.payload.role }
    }
    const handleRejected = (state, action) => {
      state.loading = false
      state.error   = action.payload
    }

    builder
      .addCase(loginUser.pending,    handlePending)
      .addCase(loginUser.fulfilled,  handleFulfilled)
      .addCase(loginUser.rejected,   handleRejected)
      .addCase(registerUser.pending,   handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected,  handleRejected)
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
