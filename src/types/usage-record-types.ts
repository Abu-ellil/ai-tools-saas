import { Document } from 'mongoose';
import { IUser } from '@/models/User'; // Assuming this path is correct

export enum ToolType {
  CHAT = 'CHAT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export interface IUsageRecord extends Document {
  id: string;
  userId: string; // This was Schema.Types.ObjectId, but for frontend type, string is often simpler. Adjust if needed.
  user: IUser['_id']; // Or simply string if you don't need the full IUser type reference here for frontend
  toolType: ToolType;
  content?: string;
  credits: number;
  createdAt: Date;
}
