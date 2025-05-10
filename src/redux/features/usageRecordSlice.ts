import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// تعريف نوع سجل الاستخدام
export interface UsageRecord {
  id: string;
  userId: string;
  toolType: 'CHAT' | 'IMAGE' | 'CODE' | 'AUDIO' | 'VIDEO';
  content?: string;
  credits: number;
  createdAt: string;
}

// تعريف حالة سجلات الاستخدام
interface UsageRecordState {
  records: UsageRecord[];
  isLoading: boolean;
  error: string | null;
}

// الحالة الأولية
const initialState: UsageRecordState = {
  records: [],
  isLoading: false,
  error: null,
};

// Async thunk للحصول على سجلات الاستخدام من MongoDB
export const fetchUsageRecords = createAsyncThunk(
  'usageRecord/fetchUsageRecords',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/usage-records/${userId}`);
      if (!response.ok) {
        throw new Error('فشل في جلب سجلات الاستخدام');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'حدث خطأ غير معروف');
    }
  }
);

// Async thunk لإنشاء سجل استخدام جديد في MongoDB
export const createUsageRecord = createAsyncThunk(
  'usageRecord/createUsageRecord',
  async (recordData: Omit<UsageRecord, 'id' | 'createdAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/usage-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordData),
      });
      if (!response.ok) {
        throw new Error('فشل في إنشاء سجل الاستخدام');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'حدث خطأ غير معروف');
    }
  }
);

// إنشاء شريحة سجلات الاستخدام
export const usageRecordSlice = createSlice({
  name: 'usageRecord',
  initialState,
  reducers: {
    // إضافة سجل استخدام
    addRecord: (state, action: PayloadAction<UsageRecord>) => {
      state.records.push(action.payload);
    },
    // مسح سجلات الاستخدام
    clearRecords: (state) => {
      state.records = [];
      state.error = null;
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
    // معالجة fetchUsageRecords
    builder
      .addCase(fetchUsageRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsageRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchUsageRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // معالجة createUsageRecord
      .addCase(createUsageRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUsageRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records.push(action.payload);
      })
      .addCase(createUsageRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// تصدير الإجراءات
export const { addRecord, clearRecords, setError, clearError } = usageRecordSlice.actions;

// تصدير المخفض
export default usageRecordSlice.reducer;
