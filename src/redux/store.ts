import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth-slice';
import drawerReducer from './drawer-slice';

export const store = configureStore({
  reducer: { user: authReducer, drawer: drawerReducer }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
