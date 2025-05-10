import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // استخدام localStorage
import { combineReducers } from "redux";
import userReducer from "./features/userSlice";
import subscriptionReducer from "./features/subscriptionSlice";
import usageRecordReducer from "./features/usageRecordSlice";

// تكوين خيارات الاستمرارية
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "subscription"], // حالات المستخدم والاشتراك ستكون مستمرة
};

// دمج جميع المخفضات
const rootReducer = combineReducers({
  user: userReducer,
  subscription: subscriptionReducer,
  usageRecord: usageRecordReducer,
});

// إنشاء مخفض مستمر
const persistedReducer = persistReducer(persistConfig, rootReducer);

// إنشاء المتجر
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // تجاهل إجراءات الاستمرارية في فحص القابلية للتسلسل
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

// إنشاء مستمر المتجر
export const persistor = persistStore(store);

// تصدير أنواع RootState و AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
