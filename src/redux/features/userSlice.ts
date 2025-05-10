import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// تعريف نوع المستخدم
export interface User {
  id: string;
  clerkId?: string;
  name: string;
  email: string;
  credits: number;
  plan?: string;
  status?: string;
}

// تعريف حالة المستخدم
interface UserState {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

// الحالة الأولية
const initialState: UserState = {
  user: null,
  isSignedIn: false,
  isLoading: false,
  error: null,
};

// Async thunk للحصول على بيانات المستخدم من MongoDB
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (clerkId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/user/${clerkId}`);
      if (!response.ok) {
        throw new Error("فشل في جلب بيانات المستخدم");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "حدث خطأ غير معروف"
      );
    }
  }
);

// Async thunk لإنشاء مستخدم جديد في MongoDB
export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: Omit<User, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("فشل في إنشاء المستخدم");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "حدث خطأ غير معروف"
      );
    }
  }
);

// Async thunk لتحديث رصيد المستخدم في MongoDB
export const updateUserCredits = createAsyncThunk(
  "user/updateUserCredits",
  async (
    { userId, credits }: { userId: string; credits: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/user/${userId}/credits`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credits }),
      });
      if (!response.ok) {
        throw new Error("فشل في تحديث رصيد المستخدم");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "حدث خطأ غير معروف"
      );
    }
  }
);

// إنشاء شريحة المستخدم
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // تسجيل الدخول
    signIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isSignedIn = true;
      state.error = null;
    },
    // تسجيل الخروج
    signOut: (state) => {
      state.user = null;
      state.isSignedIn = false;
      state.error = null;
    },
    // تحديث رصيد المستخدم محليًا
    updateCredits: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.credits = action.payload;
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
    // معالجة fetchUserData
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSignedIn = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // معالجة createUser
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSignedIn = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // معالجة updateUserCredits
      .addCase(updateUserCredits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.credits = action.payload.credits;
        }
      })
      .addCase(updateUserCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// تصدير الإجراءات
export const { signIn, signOut, updateCredits, setError, clearError } =
  userSlice.actions;

// تصدير المخفض
export default userSlice.reducer;
