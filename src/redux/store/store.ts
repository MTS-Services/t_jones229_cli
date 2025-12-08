import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { baseApi } from "../api/baseApi";
import authReducer from "../slices/authSlice";
import paymentMethodReducer from "../slices/paymentMethodSlice";
import imageUrlReducer from "../slices/uploadImageSlice";

// SSR-compatible storage fallback
const createNoopStorage = () => {
  return {
    getItem(): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any): Promise<any> {
      return Promise.resolve(value);
    },
    removeItem(): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// ✅ Persist configuration
const authPersistConfig = {
  key: "auth",
  storage,
};

const paymentPersistConfig = {
  key: "paymentMethod",
  storage,
};

const imageUrlPersistConfig = {
  key: "imageUrl",
  storage,
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistReducer(authPersistConfig, authReducer),
  paymentMethod: persistReducer(paymentPersistConfig, paymentMethodReducer),
  imageUrl: persistReducer(imageUrlPersistConfig, imageUrlReducer), // ✅ added
});

// ✅ Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// ✅ Persistor
export const persistor = persistStore(store);

// ✅ Types
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
