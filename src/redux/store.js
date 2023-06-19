import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'
import notificationReducer from './notificationSlice'
import dentalReducer from "./dentalSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dental: dentalReducer,
        notification: notificationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
