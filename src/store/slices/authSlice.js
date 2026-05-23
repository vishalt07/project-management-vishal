import { createSlice } from '@reduxjs/toolkit'

const savedUser = JSON.parse(localStorage.getItem('pm_user') || 'null')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    isAuthenticated: !!savedUser,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('pm_user', JSON.stringify(action.payload))
    },
    signup(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('pm_user', JSON.stringify(action.payload))
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('pm_user')
    },
  },
})

export const { login, signup, logout } = authSlice.actions
export default authSlice.reducer
