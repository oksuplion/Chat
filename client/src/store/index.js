import { configureStore } from '@reduxjs/toolkit';
import chatSlice from './chatSlice';

export default configureStore({
  reducer: {
    chat: chatSlice,
  }
})
