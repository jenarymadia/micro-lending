import { configureStore } from '@reduxjs/toolkit';
import tenantReducer from './slices/tenantSlice';

export const store = configureStore({
  reducer: {
    tenant: tenantReducer,
  },
  // Enable Redux DevTools integration
  devTools: import.meta.env.MODE === 'development',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;