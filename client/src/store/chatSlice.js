import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    message: "",
    params: {
      user: "",
      room: "",
    },
    users: 0,
    state: []
  },
  reducers: {
    setParams(state, action) {
      console.log(' setParams action', action.payload);
      state.params = action.payload;
    },
    setMessage(state, action) {
      console.log('addMessage action', action.payload);
      state.message = action.payload;
    },
    setUsers(state, action) {
      console.log(' setUsers action', action.payload);
      state.users = action.payload;
    },
    setState(state, action) {
      console.log(' setState action', action.payload);
      state.state = [...state.state, action.payload];
    },
  }
})

export const { setParams, setMessage, setUsers, setState } = chatSlice.actions;

export default chatSlice.reducer;
