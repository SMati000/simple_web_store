import { createSlice } from '@reduxjs/toolkit';
import logger from '@/utils/logger';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    pcRoles: [],
    accessToken: '',
    idToken: '',
    isLoading: false,
    isAuthenticated: false,
    productosVisitados: 0,
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.name;
      state.email = action.payload.email;
      state.pcRoles = action.payload.pcRoles;
      state.accessToken = action.payload.accessToken;
      state.idToken = action.payload.idToken;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.productosVisitados = 0; // p el usuario loggeado no es necesario
      logger.debug("setUser", state)
    },
    clearUser: (state) => {
      state.username = '';
      state.email = '';
      state.pcRoles = [];
      state.accessToken = '';
      state.idToken = '';
      state.isLoading = false;
      state.isAuthenticated = false;
      state.productosVisitados = 0;
      logger.debug("clearUser", state)
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
      logger.debug("setAuthLoading", state)
    },
    sumarProductosVisitados: (state) => {
      state.productosVisitados += 1;
      logger.debug("setProductosVisitados", state)
    },
  },
});

export const { setUser, clearUser, setAuthLoading, sumarProductosVisitados } = userSlice.actions;
export default userSlice.reducer;
