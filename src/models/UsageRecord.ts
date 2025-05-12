import mongoose, { Schema } from 'mongoose'; // Document might not be needed directly here if IUsageRecord handles it
// import { IUser } from './User'; // Removed as IUser is not directly used here
import { IUsageRecord, ToolType } from '@/types/usage-record-types'; // Adjusted import path

const UsageRecordSchema: Schema = new Schema<IUsageRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Note: In IUsageRecord, userId is string. Mongoose schema uses ObjectId. This is a common pattern.
    // user field is not explicitly defined in schema here as it's populated, ensure IUsageRecord matches this intent.
    toolType: { type: String, enum: Object.values(ToolType), required: true },
    content: { type: String },
    credits: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.UsageRecord || mongoose.model<IUsageRecord>('UsageRecord', UsageRecordSchema);
