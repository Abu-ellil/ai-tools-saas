import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export enum ToolType {
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export interface IUsageRecord extends Document {
  id: string;
  userId: string;
  user: IUser['_id'];
  toolType: ToolType;
  content?: string;
  credits: number;
  createdAt: Date;
}

const UsageRecordSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
