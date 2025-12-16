import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { baseApi } from "../api/baseApi";
import authReducer from "../slices/authSlice";
import paymentMethodReducer from "../slices/paymentMethodSlice";
import imageUrlReducer from "../slices/uploadImageSlice";

// SSR-compatible storage fallback with iOS Safari fixes
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

// Enhanced storage wrapper with error handling for iOS Safari
const createSafeStorage = () => {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }
  
  try {
    // Test if localStorage is available and working
    const testKey = "__redux_persist_test__";
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);
    return createWebStorage("local");
  } catch (error) {
    console.error("localStorage not available, using noop storage:", error);
    return createNoopStorage();
  }
};

const storage = createSafeStorage();

// ✅ Persist configuration with whitelists to reduce storage size
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"], // Only persist essential auth data
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

// ✅ Persistor with error handling
export const persistor = typeof window !== "undefined" 
  ? persistStore(store, null, () => {
      // Callback after rehydration
      console.log("Redux persist rehydration complete");
    })
  : null;

// ✅ Types
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
