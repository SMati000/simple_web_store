import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    pcRoles: [],
    accessToken: '',
    idToken: '',
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.name;
      state.email = action.payload.email;
      state.pcRoles = action.payload.pcRoles;
      state.accessToken = action.payload.accessToken;
      state.idToken = action.payload.idToken;

      localStorage.setItem('access_token', state.accessToken);
      localStorage.setItem('id_token', state.idToken);
    },
    clearUser: (state) => {
      state.username = '';
      state.email = '';
      state.pcRoles = [];
      state.accessToken = '';
      state.idToken = '';

      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
