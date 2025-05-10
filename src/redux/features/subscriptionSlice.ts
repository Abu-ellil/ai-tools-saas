import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// تعريف نوع الاشتراك
export interface Subscription {
  id: string;
  userId: string;
  plan: 'FREE' | 'BASIC' | 'PRO';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  credits: number;
  createdAt: string;
  updatedAt: string;
}

// تعريف حالة الاشتراك
interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
}

// الحالة الأولية
const initialState: SubscriptionState = {
  subscription: null,
  isLoading: false,
  error: null,
};

// Async thunk للحصول على بيانات الاشتراك من MongoDB
export const fetchSubscription = createAsyncThunk(
  'subscription/fetchSubscription',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/subscription/${userId}`);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الاشتراك');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'حدث خطأ غير معروف');
    }
  }
);

// Async thunk لإنشاء اشتراك جديد في MongoDB
export const createSubscription = createAsyncThunk(
  'subscription/createSubscription',
  async (subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });
      if (!response.ok) {
        throw new Error('فشل في إنشاء الاشتراك');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'حدث خطأ غير معروف');
    }
  }
);

// Async thunk لتحديث رصيد الاشتراك في MongoDB
export const updateSubscriptionCredits = createAsyncThunk(
  'subscription/updateSubscriptionCredits',
  async ({ subscriptionId, credits }: { subscriptionId: string; credits: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/subscription/${subscriptionId}/credits`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits }),
      });
      if (!response.ok) {
        throw new Error('فشل في تحديث رصيد الاشتراك');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'حدث خطأ غير معروف');
    }
  }
);

// إنشاء شريحة الاشتراك
export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    // تعيين الاشتراك
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
      state.error = null;
    },
    // مسح الاشتراك
    clearSubscription: (state) => {
      state.subscription = null;
      state.error = null;
    },
    // تحديث رصيد الاشتراك محليًا
    updateCredits: (state, action: PayloadAction<number>) => {
      if (state.subscription) {
        state.subscription.credits = action.payload;
      }
    },
    // تعيين خطأ
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    // مسح الخطأ
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // معالجة fetchSubscription
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // معالجة createSubscription
      .addCase(createSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscription = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // معالجة updateSubscriptionCredits
      .addCase(updateSubscriptionCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.subscription) {
          state.subscription.credits = action.payload.credits;
        }
      })
      .addCase(updateSubscriptionCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// تصدير الإجراءات
export const { setSubscription, clearSubscription, updateCredits, setError, clearError } = subscriptionSlice.actions;

// تصدير المخفض
export default subscriptionSlice.reducer;
